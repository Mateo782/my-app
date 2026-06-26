import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import db from "@/lib/db";
import EditRecipeForm from "./EditRecipeForm";
import RecipeImageUpload from "@/components/RecipeImageUpload";
import type { Ingredient } from "@/components/IngredientsEditor";
import StaggerContainer from "@/components/motion/StaggerContainer";
import StaggerItem from "@/components/motion/StaggerItem";

type RecipeRow = {
  id: string;
  title: string;
  ingredients: string;
  method: string;
  image_url: string | null;
};

export default async function EditRecipePage({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<React.JSX.Element> {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/authenticate");

  const row = db
    .query<RecipeRow, [string, string]>(
      "SELECT id, title, ingredients, method, image_url FROM recipes WHERE id = ? AND user_id = ?"
    )
    .get(id, session.user.id);

  if (!row) notFound();

  let ingredients: Ingredient[];
  let method: object;

  try {
    const parsed = JSON.parse(row.ingredients);
    ingredients =
      Array.isArray(parsed) && parsed.length > 0
        ? parsed
        : [{ name: "", quantity: "" }];
  } catch {
    ingredients = [{ name: "", quantity: "" }];
  }

  try {
    method = JSON.parse(row.method);
  } catch {
    method = {};
  }

  return (
    <div className="max-w-2xl">
      <StaggerContainer>
        <StaggerItem variant="heading" className="mb-8 flex items-center gap-3">
          <Link
            href={`/recipes/${id}`}
            className="text-sm text-zinc-500 transition-colors hover:text-zinc-700"
          >
            ← Recipe
          </Link>
          <h1 className="text-2xl font-semibold text-zinc-900">Edit Recipe</h1>
        </StaggerItem>
        <StaggerItem className="mb-8">
          <RecipeImageUpload
            recipeId={row.id}
            currentImageUrl={row.image_url ?? null}
          />
        </StaggerItem>
        {/* Form fields are StaggerItems too — variants propagate through <form> */}
        <EditRecipeForm
          recipe={{ id: row.id, title: row.title, ingredients, method }}
        />
      </StaggerContainer>
    </div>
  );
}
