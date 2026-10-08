// Server-only TiDB Cloud access (free "Starter" tier).
// Uses TiDB's HTTP driver, so it works on Vercel serverless/edge without TCP sockets.
import { connect, type Connection } from "@tidbcloud/serverless";
import { BACKUP_ADMIN_USERS, DEFAULT_CATEGORIES } from "./seed-data";

type Row = Record<string, any>;

let conn: Connection<any> | null = null;
let dbName = "test";

// TiDB's own system schemas must never hold app tables (the TiDB "Connect" screen shows "sys").
const SYSTEM_DATABASES = [
  "",
  "sys",
  "mysql",
  "information_schema",
  "performance_schema",
  "metrics_schema",
];

function getDatabaseUrl(): string {
  const url = process.env["DATABASE_URL"] || process.env["TIDB_DATABASE_URL"] || "";
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Add your TiDB Cloud connection string in Vercel → Settings → Environment Variables.",
    );
  }
  return url;
}

function getConnection(database?: string) {
  if (conn && database === undefined) return conn;
  const raw = getDatabaseUrl();
  const parsed = new URL(raw.replace(/^mysql:\/\//, "https://"));
  const fromUrl = decodeURIComponent(parsed.pathname.replace(/^\//, "")).replace(
    /[^A-Za-z0-9_]/g,
    "",
  );
  dbName = SYSTEM_DATABASES.includes(fromUrl.toLowerCase()) ? "test" : fromUrl;

  // Local testing hook: route the HTTP driver to a stand-in endpoint.
  const override = process.env["TIDB_HTTP_ENDPOINT_OVERRIDE"];
  const customFetch = override
    ? (_input: string, init?: any) => fetch(override, init) as any
    : undefined;

  const c = connect({
    host: parsed.hostname,
    username: decodeURIComponent(parsed.username),
    password: decodeURIComponent(parsed.password),
    database: database ?? dbName,
    ...(customFetch ? { fetch: customFetch } : {}),
  });
  if (database === undefined) conn = c;
  return c;
}

let schemaReady: Promise<void> | null = null;

/** Run a query (with `?` placeholders) and return rows as objects. */
export async function query<T = Row>(sql: string, args: unknown[] = []): Promise<T[]> {
  await ensureSchema();
  return raw<T>(sql, args);
}

async function raw<T = Row>(sql: string, args: unknown[] = []): Promise<T[]> {
  const rows = await getConnection().execute(sql, args.length ? (args as any[]) : null);
  return (rows as T[]) ?? [];
}

export function newId(): string {
  return crypto.randomUUID();
}

/** Current UTC time in MySQL DATETIME(3) format. */
export function nowSql(): string {
  return new Date().toISOString().replace("T", " ").replace("Z", "");
}

/** Convert a DATETIME string stored as UTC to an ISO string for the browser. */
export function toIso(value: unknown): string {
  if (!value) return "";
  const s = String(value);
  if (s.includes("T")) return s;
  return s.replace(" ", "T") + "Z";
}

export function toNum(value: unknown): number {
  if (value === null || value === undefined || value === "") return 0;
  return Number(value);
}

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS admin_users (
    id CHAR(36) NOT NULL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at DATETIME(3) NOT NULL,
    UNIQUE KEY uq_admin_email (email)
  )`,
  `CREATE TABLE IF NOT EXISTS categories (
    id CHAR(36) NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    created_at DATETIME(3) NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS products (
    id CHAR(36) NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    description TEXT NULL,
    price DECIMAL(12,2) NOT NULL DEFAULT 0,
    image TEXT NULL,
    category_id CHAR(36) NULL,
    created_at DATETIME(3) NOT NULL,
    KEY idx_products_category (category_id),
    KEY idx_products_created (created_at)
  )`,
  `CREATE TABLE IF NOT EXISTS quotes (
    id CHAR(36) NOT NULL PRIMARY KEY,
    user_type VARCHAR(100) NULL,
    category_id CHAR(36) NULL,
    area_sqft DECIMAL(12,2) NOT NULL DEFAULT 0,
    estimated_price DECIMAL(12,2) NOT NULL DEFAULT 0,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    project_notes TEXT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'Pending',
    created_at DATETIME(3) NOT NULL,
    KEY idx_quotes_created (created_at)
  )`,
  `CREATE TABLE IF NOT EXISTS contacts (
    id CHAR(36) NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(100) NULL,
    category_id CHAR(36) NULL,
    project_details TEXT NULL,
    created_at DATETIME(3) NOT NULL,
    KEY idx_contacts_created (created_at)
  )`,
  `CREATE TABLE IF NOT EXISTS gallery (
    id CHAR(36) NOT NULL PRIMARY KEY,
    title VARCHAR(255) NULL,
    image_url TEXT NOT NULL,
    storage_path VARCHAR(255) NULL,
    category VARCHAR(255) NULL,
    created_at DATETIME(3) NOT NULL,
    KEY idx_gallery_created (created_at)
  )`,
  `CREATE TABLE IF NOT EXISTS images (
    id CHAR(36) NOT NULL PRIMARY KEY,
    mime VARCHAR(100) NOT NULL,
    size INT NOT NULL,
    data MEDIUMBLOB NOT NULL,
    created_at DATETIME(3) NOT NULL
  )`,
];

/** Creates tables on first use and seeds the admin login + default categories. */
export function ensureSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = (async () => {
      try {
        await raw(SCHEMA[0]!);
      } catch (err) {
        // Database named in DATABASE_URL doesn't exist yet → create it, then continue.
        if (!/unknown database/i.test(String((err as Error)?.message))) throw err;
        await getConnection("").execute(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
      }
      for (const stmt of SCHEMA) await raw(stmt);

      // INSERT IGNORE + fixed ids keeps this safe if two cold starts run it at once.
      for (const u of BACKUP_ADMIN_USERS) {
        await raw(
          "INSERT IGNORE INTO admin_users (id, email, password_hash, created_at) VALUES (?, ?, ?, ?)",
          [u.id, u.email, u.password_hash, u.created_at],
        );
      }

      const catCount = await raw<{ n: number }>("SELECT COUNT(*) AS n FROM categories");
      if (toNum(catCount[0]?.n) === 0) {
        for (const c of DEFAULT_CATEGORIES) {
          await raw(
            "INSERT IGNORE INTO categories (id, name, slug, created_at) VALUES (?, ?, ?, ?)",
            [c.id, c.name, c.slug, nowSql()],
          );
        }
      }
    })().catch((err) => {
      schemaReady = null; // retry on next request
      throw err;
    });
  }
  return schemaReady;
}
