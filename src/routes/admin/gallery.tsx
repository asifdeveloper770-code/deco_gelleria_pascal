import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { AdminLayout } from "@/components/admin-layout";
import { Loader2, Trash2, Upload, Image as ImageIcon } from "lucide-react";

export const Route = createFileRoute("/admin/gallery")({
  component: AdminGalleryPage,
});

interface GalleryItem {
  id: string;
  title: string;
  image_url: string;
  storage_path: string;
  created_at: string;
}

function AdminGalleryPage() {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // Fetch Gallery Items
  const { data: galleryItems, isLoading } = useQuery({
    queryKey: ["gallery"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gallery")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as GalleryItem[];
    },
  });

  // Delete Image Mutation
  const deleteMutation = useMutation({
    mutationFn: async (item: GalleryItem) => {
      const { error: storageError } = await supabase.storage
        .from("gallery")
        .remove([item.storage_path]);

      if (storageError) console.error("Storage delete warning:", storageError);

      const { error: dbError } = await supabase
        .from("gallery")
        .delete()
        .eq("id", item.id);

      if (dbError) throw dbError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
    },
  });

  // Handle Upload
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title.trim()) return;

    try {
      setUploading(true);

      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("gallery")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("gallery")
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase.from("gallery").insert({
        title,
        image_url: urlData.publicUrl,
        storage_path: filePath,
      });

      if (dbError) throw dbError;

      setTitle("");
      setFile(null);
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Gallery Showcase</h1>
          <p className="mt-1 text-xs text-slate-400">
            Upload images to Supabase storage and manage website gallery items.
          </p>
        </div>

        {/* Upload Form */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
          <h2 className="text-sm font-bold text-white">Upload New Image</h2>
          <form onSubmit={handleUpload} className="mt-4 grid gap-4 md:grid-cols-3">
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Title / Caption
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. WPC Wall Panels Setup"
                required
                className="mt-1.5 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-100 placeholder-slate-600 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Image File
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                required
                className="mt-1.5 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-slate-300 file:mr-3 file:rounded-md file:border-0 file:bg-slate-800 file:px-2.5 file:py-1 file:text-xs file:font-semibold file:text-slate-200"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={uploading || !file || !title}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 transition-all hover:bg-emerald-400 disabled:opacity-50"
              >
                {uploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                {uploading ? "Uploading..." : "Upload to Gallery"}
              </button>
            </div>
          </form>
        </div>

        {/* Gallery Grid */}
        <div>
          <h3 className="mb-4 text-sm font-bold text-white">Uploaded Images</h3>

          {isLoading ? (
            <div className="flex h-48 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
            </div>
          ) : galleryItems?.length === 0 ? (
            <div className="flex h-48 flex-col items-center justify-center rounded-xl border border-dashed border-slate-800 bg-slate-900/20 p-6 text-center">
              <ImageIcon className="h-8 w-8 text-slate-600" />
              <p className="mt-2 text-xs text-slate-400">
                No images found in the gallery storage table.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {galleryItems?.map((item) => (
                <div
                  key={item.id}
                  className="group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60 transition-all hover:border-slate-700"
                >
                  <div className="aspect-video w-full overflow-hidden bg-slate-950">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex items-center justify-between p-4">
                    <div>
                      <p className="text-xs font-semibold text-slate-200">
                        {item.title}
                      </p>
                      <p className="mt-0.5 text-[10px] text-slate-500">
                        {new Date(item.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteMutation.mutate(item)}
                      disabled={deleteMutation.isPending}
                      className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
                      title="Delete Image"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}