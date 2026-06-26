"use server";

import nodePath from "node:path";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import db from "@/lib/db";

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

export async function uploadRecipeImage(
  id: string,
  formData: FormData
): Promise<{ error?: string }> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "Not authenticated." };

  const owns = db
    .query<{ id: string }, [string, string]>(
      "SELECT id FROM recipes WHERE id = ? AND user_id = ?"
    )
    .get(id, session.user.id);
  if (!owns) return { error: "Recipe not found." };

  const file = formData.get("image") as File | null;
  if (!file || file.size === 0) return { error: "No file provided." };

  if (file.size > MAX_SIZE) return { error: "File is too large (max 5 MB)." };

  const ext = ALLOWED_TYPES[file.type];
  if (!ext) return { error: "Allowed formats: JPEG, PNG, WebP." };

  const filename = `recipe-${id}.${ext}`;
  const filePath = nodePath.join(process.cwd(), "public", "uploads", filename);

  try {
    await Bun.write(filePath, file);
  } catch {
    return { error: "Failed to save image. Please try again." };
  }

  db.run("UPDATE recipes SET image_url = ? WHERE id = ? AND user_id = ?", [
    `/uploads/${filename}`,
    id,
    session.user.id,
  ]);

  revalidatePath(`/recipes/${id}`);
  revalidatePath(`/recipes/${id}/edit`);

  return {};
}
