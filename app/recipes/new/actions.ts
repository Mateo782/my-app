"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import db from "@/lib/db";
import { validateRecipeForm } from "@/lib/recipes/validation";

export type ActionState = { error: string } | null;

export async function createRecipe(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "Not authenticated." };

  const validated = validateRecipeForm(formData);
  if ("error" in validated) return validated;

  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  db.run(
    `INSERT INTO recipes (id, user_id, title, ingredients, method, is_public, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, 0, ?, ?)`,
    [
      id,
      session.user.id,
      validated.title,
      JSON.stringify(validated.ingredients),
      JSON.stringify(validated.method),
      now,
      now,
    ]
  );

  redirect("/recipes");
}
