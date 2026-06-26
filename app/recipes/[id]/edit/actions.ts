"use server";

import { redirect, notFound } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import db from "@/lib/db";
import { validateRecipeForm } from "@/lib/recipes/validation";

export type ActionState = { error: string } | null;

export async function updateRecipe(
  id: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "Not authenticated." };

  const validated = validateRecipeForm(formData);
  if ("error" in validated) return validated;

  const now = new Date().toISOString();

  const result = db.run(
    `UPDATE recipes SET title = ?, ingredients = ?, method = ?, updated_at = ?
     WHERE id = ? AND user_id = ?`,
    [
      validated.title,
      JSON.stringify(validated.ingredients),
      JSON.stringify(validated.method),
      now,
      id,
      session.user.id,
    ]
  );

  if (result.changes === 0) notFound();

  redirect(`/recipes/${id}`);
}
