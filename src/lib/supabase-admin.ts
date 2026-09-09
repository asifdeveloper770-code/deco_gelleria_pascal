import { supabase } from "./supabase";

// Database Type Definitions
export interface Product {
  id?: string;
  name: string;
  category: "WPC Panels" | "UV Marble" | "WPC Decking" | "Fencing";
  stock: number;
  price: string;
  image_url?: string;
  created_at?: string;
}

export interface Quote {
  id?: string;
  client_name: string;
  client_email: string;
  product_name: string;
  coverage_area: string;
  status: "Pending" | "Approved" | "In Review" | "Rejected";
  created_at?: string;
}

export interface ContactInquiry {
  id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at?: string;
}

export interface DashboardStats {
  totalProducts: number;
  pendingQuotes: number;
  totalContacts: number;
}

/**
 * AUTHENTICATION SERVICES
 */
export async function getCurrentAdminSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

export async function signOutAdmin() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/**
 * DASHBOARD METRICS
 */
export async function fetchDashboardStats(): Promise<DashboardStats> {
  const [productsCount, quotesCount, contactsCount] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("quotes").select("*", { count: "exact", head: true }).eq("status", "Pending"),
    supabase.from("contacts").select("*", { count: "exact", head: true }),
  ]);

  return {
    totalProducts: productsCount.count || 0,
    pendingQuotes: quotesCount.count || 0,
    totalContacts: contactsCount.count || 0,
  };
}

/**
 * PRODUCTS CRUD
 */
export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createProduct(product: Omit<Product, "id" | "created_at">): Promise<Product> {
  const { data, error } = await supabase
    .from("products")
    .insert([product])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
  const { data, error } = await supabase
    .from("products")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
}

/**
 * QUOTES SERVICES
 */
export async function fetchQuotes(): Promise<Quote[]> {
  const { data, error } = await supabase
    .from("quotes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function updateQuoteStatus(id: string, status: Quote["status"]): Promise<Quote> {
  const { data, error } = await supabase
    .from("quotes")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * CONTACTS SERVICES
 */
export async function fetchContacts(): Promise<ContactInquiry[]> {
  const { data, error } = await supabase
    .from("contacts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

/**
 * REAL-TIME SUBSCRIPTIONS
 */
export function subscribeToQuotes(onNewQuote: (quote: Quote) => void) {
  return supabase
    .channel("public:quotes")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "quotes" },
      (payload) => {
        onNewQuote(payload.new as Quote);
      }
    )
    .subscribe();
}