import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { AdminLayout } from "@/components/admin-layout";
import { Loader2, Plus, Trash2, Package, Edit2, Image as ImageIcon, Upload, Images, X, Check } from "lucide-react";

export const Route = createFileRoute("/admin/products")({
  component: AdminProductsPage,
});

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Product {
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

interface GalleryItem {
  id: string;
  title?: string | null;
  image_url: string;
  storage_path: string;
  category?: string | null;
  created_at: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function AdminProductsPage() {
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [image, setImage] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // Fetch Categories
  const { data: categories = [], isLoading: isLoadingCategories, error: categoryError } = useQuery({
    queryKey: ["admin_categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name, slug")
        .order("name", { ascending: true });

      if (error) {
        console.error("Error fetching categories:", error);
        throw error;
      }
      return data as Category[];
    },
  });

  // Fetch Gallery Images
  const { data: galleryItems = [], isLoading: isLoadingGallery } = useQuery({
    queryKey: ["admin_gallery"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gallery")
        .select("id, title, image_url, storage_path, category, created_at")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as GalleryItem[];
    },
  });

  // Fetch Products joined with Categories
  const { data: products, isLoading } = useQuery({
    queryKey: ["admin_products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, categories(id, name, slug)")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Product[];
    },
  });

  // Handle Local File Upload to Supabase Storage
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("products")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("products").getPublicUrl(filePath);
      setImage(data.publicUrl);
    } catch (err) {
      console.error("Image upload failed:", err);
      alert("Failed to upload image. Make sure the 'products' bucket exists and has public RLS policies.");
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setSlug("");
    setDescription("");
    setPrice("");
    setImage("");
    setCategoryId("");
    setEditingId(null);
    setIsAdding(false);
  };

  const startEditing = (p: Product) => {
    setIsAdding(false);
    setEditingId(p.id);
    setName(p.name);
    setSlug(p.slug);
    setDescription(p.description || "");
    setPrice(p.price);
    setImage(p.image || "");
    setCategoryId(p.category_id || "");
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingId) {
      setSlug(slugify(val));
    }
  };

  const createMutation = useMutation({
    mutationFn: async (newProduct: Omit<Product, "id" | "categories">) => {
      const { data, error } = await supabase
        .from("products")
        .insert([newProduct])
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_products"] });
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (updatedProduct: Omit<Product, "categories">) => {
      const { data, error } = await supabase
        .from("products")
        .update({
          name: updatedProduct.name,
          slug: updatedProduct.slug,
          description: updatedProduct.description,
          price: updatedProduct.price,
          image: updatedProduct.image,
          category_id: updatedProduct.category_id,
        })
        .eq("id", updatedProduct.id)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_products"] });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_products"] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug || price === "") return;

    const payload = {
      name,
      slug,
      description: description || null,
      price: Number(price),
      image: image || null,
      category_id: categoryId || null,
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, ...payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Product Catalog</h1>
            <p className="mt-1 text-xs text-slate-400">
              Manage inventory items, pricing, and category mapping.
            </p>
          </div>
          <button
            onClick={() => {
              if (isAdding || editingId) resetForm();
              else {
                resetForm();
                setIsAdding(true);
              }
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 transition-all hover:bg-emerald-400"
          >
            <Plus className="h-4 w-4" />
            {isAdding || editingId ? "Cancel" : "Add Product"}
          </button>
        </div>

        {(isAdding || editingId) && (
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
            <h2 className="text-sm font-bold text-white">
              {editingId ? "Edit Catalog Item" : "Add New Catalog Item"}
            </h2>
            <form onSubmit={handleSubmit} className="mt-4 grid gap-4 md:grid-cols-3">
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Oak Fluted WPC Panel"
                  required
                  className="mt-1.5 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-100 placeholder-slate-600 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Slug *
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="oak-fluted-wpc-panel"
                  required
                  className="mt-1.5 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-100 placeholder-slate-600 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Category
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  disabled={isLoadingCategories}
                  className="mt-1.5 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-100 focus:border-emerald-500 focus:outline-none disabled:opacity-50"
                >
                  <option value="" className="bg-slate-950 text-slate-100">
                    {isLoadingCategories ? "Loading categories..." : "Uncategorized"}
                  </option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id} className="bg-slate-950 text-slate-100">
                      {cat.name}
                    </option>
                  ))}
                </select>
                {categoryError && (
                  <p className="mt-1 text-[10px] text-red-400">Failed to load categories from database.</p>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Price ($) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={(e) =>
                    setPrice(e.target.value === "" ? "" : Number(e.target.value))
                  }
                  placeholder="45.99"
                  required
                  className="mt-1.5 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-100 placeholder-slate-600 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              {/* Product Image Control & Gallery Picker */}
              <div className="md:col-span-2">
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Product Image
                </label>
                <div className="mt-1.5 flex items-center gap-3">
                  {image ? (
                    <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg border border-slate-800">
                      <img src={image} alt="Preview" className="h-full w-full object-cover" />
                    </div>
                  ) : (
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-slate-800 bg-slate-950 text-slate-600">
                      <ImageIcon className="h-4 w-4" />
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs font-medium text-slate-300 transition-colors hover:border-slate-700 hover:text-white">
                      {isUploading ? (
                        <Loader2 className="h-4 w-4 animate-spin text-emerald-500" />
                      ) : (
                        <Upload className="h-4 w-4 text-emerald-500" />
                      )}
                      <span>{isUploading ? "Uploading..." : "Upload File"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        disabled={isUploading}
                        className="hidden"
                      />
                    </label>

                    <button
                      type="button"
                      onClick={() => setIsGalleryOpen(true)}
                      className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs font-medium text-slate-300 transition-colors hover:border-slate-700 hover:text-white"
                    >
                      <Images className="h-4 w-4 text-emerald-500" />
                      Select from Gallery
                    </button>
                  </div>

                  {image && (
                    <button
                      type="button"
                      onClick={() => setImage("")}
                      className="text-[10px] font-semibold text-red-400 hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>

              <div className="md:col-span-3">
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Product specs, features..."
                  className="mt-1.5 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-100 placeholder-slate-600 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="md:col-span-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg border border-slate-800 px-4 py-2 text-xs font-semibold text-slate-400 hover:bg-slate-800 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending || isUploading}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-5 py-2 text-xs font-bold text-slate-950 transition-all hover:bg-emerald-400 disabled:opacity-50"
                >
                  {(createMutation.isPending || updateMutation.isPending) && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                  {editingId ? "Update Product" : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Products Table */}
        <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/40">
          {isLoading ? (
            <div className="flex h-48 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
            </div>
          ) : products?.length === 0 ? (
            <div className="flex h-48 flex-col items-center justify-center p-6 text-center">
              <Package className="h-8 w-8 text-slate-600" />
              <p className="mt-2 text-xs text-slate-400">No products found in database.</p>
            </div>
          ) : (
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="border-b border-slate-800 bg-slate-900 text-[10px] uppercase text-slate-400">
                <tr>
                  <th className="p-4">Product</th>
                  <th className="p-4">Slug</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {products?.map((p) => (
                  <tr key={p.id} className="transition-colors hover:bg-slate-800/30">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {p.image ? (
                          <img
                            src={p.image}
                            alt={p.name}
                            className="h-9 w-9 rounded-md border border-slate-800 object-cover"
                          />
                        ) : (
                          <div className="flex h-9 w-9 items-center justify-center rounded-md border border-slate-800 bg-slate-950 text-slate-600">
                            <ImageIcon className="h-4 w-4" />
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-white">{p.name}</div>
                          {p.description && (
                            <p className="line-clamp-1 max-w-xs text-[11px] text-slate-500">
                              {p.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-slate-400">{p.slug}</td>
                    <td className="p-4 text-slate-400">
                      {p.categories?.name || "Uncategorized"}
                    </td>
                    <td className="p-4 font-semibold text-emerald-400">
                      ${Number(p.price).toFixed(2)}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => startEditing(p)}
                          className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
                          title="Edit Product"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteMutation.mutate(p.id)}
                          disabled={deleteMutation.isPending}
                          className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
                          title="Delete Product"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Gallery Selector Modal */}
      {isGalleryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="relative flex max-h-[80vh] w-full max-w-3xl flex-col rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white">Select Image from Gallery</h3>
                <p className="text-xs text-slate-400">Choose an existing media asset for this product.</p>
              </div>
              <button
                onClick={() => setIsGalleryOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="my-4 flex-1 overflow-y-auto pr-1">
              {isLoadingGallery ? (
                <div className="flex h-48 items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
                </div>
              ) : galleryItems.length === 0 ? (
                <div className="flex h-48 flex-col items-center justify-center text-center">
                  <Images className="h-8 w-8 text-slate-600" />
                  <p className="mt-2 text-xs text-slate-400">No images found in gallery.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                  {galleryItems.map((item) => {
                    const isSelected = image === item.image_url;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setImage(item.image_url);
                          setIsGalleryOpen(false);
                        }}
                        className={`group relative aspect-square overflow-hidden rounded-lg border bg-slate-950 text-left transition-all ${
                          isSelected
                            ? "border-emerald-500 ring-2 ring-emerald-500/20"
                            : "border-slate-800 hover:border-slate-700"
                        }`}
                      >
                        <img
                          src={item.image_url}
                          alt={item.title || "Gallery Item"}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        {isSelected && (
                          <div className="absolute inset-0 flex items-center justify-center bg-emerald-500/20 backdrop-blur-[1px]">
                            <div className="rounded-full bg-emerald-500 p-1 text-slate-950">
                              <Check className="h-4 w-4" />
                            </div>
                          </div>
                        )}
                        {item.title && (
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 to-transparent p-2">
                            <p className="truncate text-[10px] font-medium text-slate-200">
                              {item.title}
                            </p>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex justify-end border-t border-slate-800 pt-4">
              <button
                type="button"
                onClick={() => setIsGalleryOpen(false)}
                className="rounded-lg border border-slate-800 px-4 py-2 text-xs font-semibold text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}