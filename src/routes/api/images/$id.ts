// Serves images stored in the TiDB `images` table at /api/images/<id>.
import { createFileRoute } from "@tanstack/react-router";
import { query } from "@/lib/server/db";

export const Route = createFileRoute("/api/images/$id")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const id = String(params.id || "").replace(/\.[a-z0-9]+$/i, "");
        if (!/^[0-9a-f-]{36}$/i.test(id)) return new Response("Not found", { status: 404 });

        const rows = await query<{ mime: string; data: Uint8Array }>(
          "SELECT mime, data FROM images WHERE id = ? LIMIT 1",
          [id],
        );
        const img = rows[0];
        if (!img) return new Response("Not found", { status: 404 });

        return new Response(img.data as unknown as BodyInit, {
          status: 200,
          headers: {
            "content-type": img.mime,
            // Image ids never change content, so browsers/CDN can cache them for a long time.
            "cache-control": "public, max-age=31536000, immutable",
          },
        });
      },
    },
  },
});
