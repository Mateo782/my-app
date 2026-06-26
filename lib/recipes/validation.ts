export type Ingredient = { name: string; quantity: string };

export function parseIngredients(raw: string): Ingredient[] | null {
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    for (const item of parsed) {
      if (
        typeof item !== "object" ||
        item === null ||
        typeof item.name !== "string" ||
        typeof item.quantity !== "string"
      )
        return null;
    }
    return parsed as Ingredient[];
  } catch {
    return null;
  }
}

export function parseMethod(raw: string): object | null {
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return null;
    const doc = parsed as Record<string, unknown>;
    if (!Array.isArray(doc.content) || doc.content.length === 0) return null;
    return parsed;
  } catch {
    return null;
  }
}

export type RecipeFormData = {
  title: string;
  ingredients: Ingredient[];
  method: object;
};

export function validateRecipeForm(
  formData: FormData
): RecipeFormData | { error: string } {
  const title = (formData.get("title") as string | null)?.trim() ?? "";
  if (!title) return { error: "Title is required." };
  if (title.length > 200) return { error: "Title must be 200 characters or fewer." };

  const ingredients = parseIngredients(
    (formData.get("ingredients") as string | null) ?? ""
  );
  if (!ingredients) return { error: "Invalid ingredients format." };
  const nonEmpty = ingredients.filter((i) => i.name.trim());
  if (nonEmpty.length === 0) return { error: "At least one ingredient is required." };

  const method = parseMethod(
    (formData.get("method") as string | null) ?? ""
  );
  if (!method) return { error: "Method is required." };

  return { title, ingredients: nonEmpty, method };
}
