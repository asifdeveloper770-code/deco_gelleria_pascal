// All database access for the site goes through these server functions.
// They run on the server (Vercel) and talk to TiDB; the browser never sees DB credentials.
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { query, newId, nowSql, toIso, toNum } from "./server/db";
import { signIn, signOut, getSession, requireAdmin } from "./server/auth";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  price: number;
  image?: string | null;
  category_id?: string | null;
  created_at?: string;
  categories?: Category | null;
}

export interface Quote {
  id: string;
  created_at: string;
  user_type: string;
  category_id: string | null;
  area_sqft: number;
  estimated_price: number;
  name: string;
  email: string;
  project_notes: string | null;
  status: "Pending" | "In Review" | "Approved" | "Rejected";
  categories: { name: string } | null;
}

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  category_id: string | null;
  project_details: string;
  created_at: string;
  categories: { name: string } | null;
}

export interface GalleryItem {
  id: string;
  title: string | null;
  image_url: string;
  storage_path: string;
  category: string | null;
  created_at: string;
}

/* ------------------------------------------------------------------ */
/* Row mappers                                                         */
/* ------------------------------------------------------------------ */

const PRODUCT_SELECT = `
  SELECT p.id, p.name, p.slug, p.description, p.price, p.image, p.category_id, p.created_at,
         c.id AS cat_id, c.name AS cat_name, c.slug AS cat_slug
  FROM products p
  LEFT JOIN categories c ON c.id = p.category_id`;

function mapProduct(r: any): Product {
  return {
    id: r.id,
    name: r.name,
    slug: r.slug,
    description: r.description ?? null,
    price: toNum(r.price),
    image: r.image ?? null,
    category_id: r.category_id ?? null,
    created_at: toIso(r.created_at),
    categories: r.cat_id ? { id: r.cat_id, name: r.cat_name, slug: r.cat_slug } : null,
  };
}

function mapQuote(r: any): Quote {
  return {
    id: r.id,
    created_at: toIso(r.created_at),
    user_type: r.user_type ?? "",
    category_id: r.category_id ?? null,
    area_sqft: toNum(r.area_sqft),
    estimated_price: toNum(r.estimated_price),
    name: r.name,
    email: r.email,
    project_notes: r.project_notes ?? null,
    status: r.status ?? "Pending",
    categories: r.cat_name ? { name: r.cat_name } : null,
  };
}

function mapContact(r: any): ContactInquiry {
  return {
    id: r.id,
    name: r.name,
    email: r.email,
    phone: r.phone ?? null,
    category_id: r.category_id ?? null,
    project_details: r.project_details ?? "",
    created_at: toIso(r.created_at),
    categories: r.cat_name ? { name: r.cat_name } : null,
  };
}

function mapGallery(r: any): GalleryItem {
  return {
    id: r.id,
    title: r.title ?? null,
    image_url: r.image_url,
    storage_path: r.storage_path ?? "",
    category: r.category ?? null,
    created_at: toIso(r.created_at),
  };
}

/* ------------------------------------------------------------------ */
/* Public (website) functions                                          */
/* ------------------------------------------------------------------ */

export const getCategories = createServerFn({ method: "GET" }).handler(async () => {
  const rows = await query<Category>("SELECT id, name, slug FROM categories ORDER BY name ASC");
  return rows.map((r) => ({ id: r.id, name: r.name, slug: r.slug }));
});

/** Products whose category name contains `match` (case-insensitive). */
export const getProductsByCategory = createServerFn({ method: "GET" })
  .validator(z.object({ match: z.string().min(1).max(100) }))
  .handler(async ({ data }) => {
    const rows = await query(
      `${PRODUCT_SELECT}
       WHERE LOWER(c.name) LIKE LOWER(?)
       ORDER BY p.created_at DESC`,
      [`%${data.match}%`],
    );
    return rows.map(mapProduct);
  });

/** Data for the public /gallery page: categories in use + every product image. */
export const getGalleryPageData = createServerFn({ method: "GET" }).handler(async () => {
  const cats = await query<{ id: string; name: string }>(
    `SELECT DISTINCT c.id, c.name
     FROM products p JOIN categories c ON c.id = p.category_id
     ORDER BY c.name ASC`,
  );
  const images = await query<{ id: string; image: string | null; category_id: string | null }>(
    "SELECT id, image, category_id FROM products ORDER BY created_at DESC",
  );
  return {
    categories: cats.map((c) => ({ id: c.id, name: c.name })),
    images: images.map((i) => ({
      id: i.id,
      image: i.image ?? null,
      category_id: i.category_id ?? null,
    })),
  };
});

export const submitQuote = createServerFn({ method: "POST" })
  .validator(
    z.object({
      user_type: z.string().max(100),
      category_id: z.string().max(36).nullable(),
      area_sqft: z.number().nonnegative(),
      estimated_price: z.number().nonnegative(),
      name: z.string().min(1).max(255),
      email: z.string().email().max(255),
      project_notes: z.string().max(10000).nullable(),
    }),
  )
  .handler(async ({ data }) => {
    await query(
      `INSERT INTO quotes (id, user_type, category_id, area_sqft, estimated_price, name, email, project_notes, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Pending', ?)`,
      [
        newId(),
        data.user_type,
        data.category_id || null,
        data.area_sqft,
        data.estimated_price,
        data.name,
        data.email,
        data.project_notes || null,
        nowSql(),
      ],
    );
    return { ok: true };
  });

export const submitContact = createServerFn({ method: "POST" })
  .validator(
    z.object({
      name: z.string().min(1).max(255),
      email: z.string().email().max(255),
      phone: z.string().max(100).nullable(),
      category_id: z.string().max(36).nullable(),
      project_details: z.string().max(10000),
    }),
  )
  .handler(async ({ data }) => {
    await query(
      `INSERT INTO contacts (id, name, email, phone, category_id, project_details, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        newId(),
        data.name,
        data.email,
        data.phone || null,
        data.category_id || null,
        data.project_details,
        nowSql(),
      ],
    );
    return { ok: true };
  });

/* ------------------------------------------------------------------ */
/* Admin auth                                                          */
/* ------------------------------------------------------------------ */

export const getAdminSession = createServerFn({ method: "GET" }).handler(async () => {
  return await getSession();
});

export const adminLogin = createServerFn({ method: "POST" })
  .validator(z.object({ email: z.string().min(1).max(255), password: z.string().min(1).max(500) }))
  .handler(async ({ data }) => {
    return await signIn(data.email, data.password);
  });

export const adminLogout = createServerFn({ method: "POST" }).handler(async () => {
  signOut();
  return { ok: true };
});

/* ------------------------------------------------------------------ */
/* Admin: dashboard                                                    */
/* ------------------------------------------------------------------ */

export const adminDashboard = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  const [p, q, c] = await Promise.all([
    query<{ n: number }>("SELECT COUNT(*) AS n FROM products"),
    query<{ n: number }>("SELECT COUNT(*) AS n FROM quotes"),
    query<{ n: number }>("SELECT COUNT(*) AS n FROM contacts"),
  ]);
  const recent = await query(
    `SELECT q.*, c.name AS cat_name FROM quotes q
     LEFT JOIN categories c ON c.id = q.category_id
     ORDER BY q.created_at DESC LIMIT 5`,
  );
  return {
    totalProducts: toNum(p[0]?.n),
    totalQuotes: toNum(q[0]?.n),
    totalContacts: toNum(c[0]?.n),
    recentQuotes: recent.map(mapQuote),
  };
});

/* ------------------------------------------------------------------ */
/* Admin: products                                                     */
/* ------------------------------------------------------------------ */

const productInput = z.object({
  name: z.string().min(1).max(255),
  slug: z.string().min(1).max(255),
  description: z.string().max(20000).nullable(),
  price: z.number(),
  image: z.string().max(5000).nullable(),
  category_id: z.string().max(36).nullable(),
});

export const adminListProducts = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  const rows = await query(`${PRODUCT_SELECT} ORDER BY p.created_at DESC`);
  return rows.map(mapProduct);
});

export const adminCreateProduct = createServerFn({ method: "POST" })
  .validator(productInput)
  .handler(async ({ data }) => {
    await requireAdmin();
    const id = newId();
    await query(
      `INSERT INTO products (id, name, slug, description, price, image, category_id, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        data.name,
        data.slug,
        data.description,
        data.price,
        data.image,
        data.category_id || null,
        nowSql(),
      ],
    );
    return { id };
  });

export const adminUpdateProduct = createServerFn({ method: "POST" })
  .validator(productInput.extend({ id: z.string().min(1).max(36) }))
  .handler(async ({ data }) => {
    await requireAdmin();
    await query(
      `UPDATE products SET name = ?, slug = ?, description = ?, price = ?, image = ?, category_id = ?
       WHERE id = ?`,
      [
        data.name,
        data.slug,
        data.description,
        data.price,
        data.image,
        data.category_id || null,
        data.id,
      ],
    );
    return { id: data.id };
  });

export const adminDeleteProduct = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string().min(1).max(36) }))
  .handler(async ({ data }) => {
    await requireAdmin();
    await query("DELETE FROM products WHERE id = ?", [data.id]);
    return { ok: true };
  });

/* ------------------------------------------------------------------ */
/* Admin: quotes                                                       */
/* ------------------------------------------------------------------ */

export const adminListQuotes = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  const rows = await query(
    `SELECT q.*, c.name AS cat_name FROM quotes q
     LEFT JOIN categories c ON c.id = q.category_id
     ORDER BY q.created_at DESC`,
  );
  return rows.map(mapQuote);
});

export const adminUpdateQuoteStatus = createServerFn({ method: "POST" })
  .validator(
    z.object({
      id: z.string().min(1).max(36),
      status: z.enum(["Pending", "In Review", "Approved", "Rejected"]),
    }),
  )
  .handler(async ({ data }) => {
    await requireAdmin();
    await query("UPDATE quotes SET status = ? WHERE id = ?", [data.status, data.id]);
    return { ok: true };
  });

export const adminDeleteQuote = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string().min(1).max(36) }))
  .handler(async ({ data }) => {
    await requireAdmin();
    await query("DELETE FROM quotes WHERE id = ?", [data.id]);
    return { ok: true };
  });

/* ------------------------------------------------------------------ */
/* Admin: contacts                                                     */
/* ------------------------------------------------------------------ */

export const adminListContacts = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  const rows = await query(
    `SELECT ct.*, c.name AS cat_name FROM contacts ct
     LEFT JOIN categories c ON c.id = ct.category_id
     ORDER BY ct.created_at DESC`,
  );
  return rows.map(mapContact);
});

export const adminDeleteContact = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string().min(1).max(36) }))
  .handler(async ({ data }) => {
    await requireAdmin();
    await query("DELETE FROM contacts WHERE id = ?", [data.id]);
    return { ok: true };
  });

/* ------------------------------------------------------------------ */
/* Admin: images + gallery (images are stored inside TiDB)             */
/* ------------------------------------------------------------------ */

const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

/** Stores an image in TiDB and returns its public URL (/api/images/<id>). */
export const adminUploadImage = createServerFn({ method: "POST" })
  .validator(
    z.object({
      mime: z.string().regex(/^image\/[a-z0-9.+-]+$/i),
      base64: z.string().min(1),
    }),
  )
  .handler(async ({ data }) => {
    await requireAdmin();
    const bin = atob(data.base64);
    if (bin.length > MAX_IMAGE_BYTES)
      throw new Error("Image is too large (max 2 MB after compression).");
    const bytes = Uint8Array.from(bin, (ch) => ch.charCodeAt(0));
    const id = newId();
    await query("INSERT INTO images (id, mime, size, data, created_at) VALUES (?, ?, ?, ?, ?)", [
      id,
      data.mime,
      bytes.length,
      bytes,
      nowSql(),
    ]);
    return { id, url: `/api/images/${id}` };
  });

export const adminListGallery = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  const rows = await query("SELECT * FROM gallery ORDER BY created_at DESC");
  return rows.map(mapGallery);
});

export const adminAddGalleryItem = createServerFn({ method: "POST" })
  .validator(
    z.object({
      title: z.string().min(1).max(255),
      image_url: z.string().min(1).max(5000),
      storage_path: z.string().max(255),
    }),
  )
  .handler(async ({ data }) => {
    await requireAdmin();
    const id = newId();
    await query(
      "INSERT INTO gallery (id, title, image_url, storage_path, created_at) VALUES (?, ?, ?, ?, ?)",
      [id, data.title, data.image_url, data.storage_path, nowSql()],
    );
    return { id };
  });

export const adminDeleteGalleryItem = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string().min(1).max(36) }))
  .handler(async ({ data }) => {
    await requireAdmin();
    const rows = await query<{ image_url: string; storage_path: string | null }>(
      "SELECT image_url, storage_path FROM gallery WHERE id = ?",
      [data.id],
    );
    await query("DELETE FROM gallery WHERE id = ?", [data.id]);
    const item = rows[0];
    // Remove the stored file too, unless a product is still using it.
    if (item?.storage_path) {
      const used = await query("SELECT id FROM products WHERE image = ? LIMIT 1", [item.image_url]);
      if (used.length === 0) await query("DELETE FROM images WHERE id = ?", [item.storage_path]);
    }
    return { ok: true };
  });
