// Browser helper: shrinks an image and uploads it to TiDB through the server.
import { adminUploadImage } from "./api";

const MAX_SIDE = 1920;
const MAX_BYTES = 1.5 * 1024 * 1024; // keeps each upload well inside TiDB + Vercel request limits

async function compress(file: File): Promise<Blob> {
  // Keep vector/animated formats as-is.
  if (/svg|gif/i.test(file.type)) return file;

  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) return file;

  let quality = 0.85;
  let side = MAX_SIDE;
  for (let attempt = 0; attempt < 6; attempt++) {
    const scale = Math.min(1, side / Math.max(bitmap.width, bitmap.height));
    const w = Math.round(bitmap.width * scale);
    const h = Math.round(bitmap.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    canvas.getContext("2d")!.drawImage(bitmap, 0, 0, w, h);
    const blob: Blob | null = await new Promise((res) => canvas.toBlob(res, "image/webp", quality));
    if (blob && blob.size <= MAX_BYTES) return blob;
    quality -= 0.12;
    side = Math.round(side * 0.8);
  }
  return file;
}

function toBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "");
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

/** Uploads an image file and returns { id, url } where url is /api/images/<id>. */
export async function uploadImage(file: File): Promise<{ id: string; url: string }> {
  const blob = await compress(file);
  if (blob.size > MAX_BYTES) {
    throw new Error("Image is too large. Please choose a smaller image.");
  }
  const base64 = await toBase64(blob);
  return await adminUploadImage({ data: { mime: blob.type || file.type || "image/jpeg", base64 } });
}
