"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import db from "@/lib/db";

export async function deleteRecipe(id: string): Promise<void> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return;

  try {
    db.run("DELETE FROM recipes WHERE id = ? AND user_id = ?", [
      id,
      session.user.id,
    ]);
  } catch (e) {
    console.error("deleteRecipe failed:", e);
    return;
  }

  revalidatePath("/recipes");
}
