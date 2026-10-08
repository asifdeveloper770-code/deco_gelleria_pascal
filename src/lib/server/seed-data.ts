// Data carried over from the Supabase backup (db_cluster-05-10-2026).
// The backup contained one admin login and no rows in products/quotes/contacts/gallery/categories.
export const BACKUP_ADMIN_USERS = [
  {
    id: "93e8b74f-4618-43a0-be37-b28c892144d3",
    email: "admin@gmail.com",
    // bcrypt hash copied from auth.users.encrypted_password — the password is unchanged.
    password_hash: "$2a$10$1ywDoSVaKMBo14Ls7pGRXeYJojCYXBO3uEL01aYnG4FyRcfvCrO8i",
    created_at: "2026-09-08 19:49:56.915",
  },
];

// Default product categories. The site's product pages filter by these names
// (Indoor / Outdoor / Acoustic / Decking / Fencing / Marble), so they are created on first run.
export const DEFAULT_CATEGORIES = [
  {
    id: "023cc055-bafc-541f-bc11-f61d27677c94",
    name: "WPC Indoor Panels",
    slug: "wpc-indoor-panels",
  },
  {
    id: "8d2675c7-e475-5c1b-bfe8-f79817cfe46e",
    name: "WPC Outdoor Panels",
    slug: "wpc-outdoor-panels",
  },
  {
    id: "dba84726-22a1-5168-8fb3-b37b36964f5f",
    name: "WPC Acoustic Panels",
    slug: "wpc-acoustic-panels",
  },
  { id: "9a9320cd-1d16-5c3c-9ccb-711893cae414", name: "WPC Decking", slug: "wpc-decking" },
  { id: "437b50c9-ca78-562b-b514-763fc2871c31", name: "WPC Fencing", slug: "wpc-fencing" },
  {
    id: "a5395bb2-df61-5211-95d6-f1a12ef28e66",
    name: "UV Marble Sheets",
    slug: "uv-marble-sheets",
  },
  { id: "66137a1b-2c3e-5754-b9d5-29a9ee1a06e2", name: "PU Stone", slug: "pu-stone" },
];
