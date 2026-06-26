import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import db from "@/lib/db";
import type { Ingredient } from "@/components/IngredientsEditor";
import RecipeMethodRenderer from "@/components/RecipeMethodRenderer";
import StaggerContainer from "@/components/motion/StaggerContainer";
import StaggerItem from "@/components/motion/StaggerItem";

type RecipeRow = {
  id: string;
  title: string;
  ingredients: string;
  method: string;
  created_at: string;
  image_url: string | null;
};

export default async function ViewRecipePage({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<React.JSX.Element> {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/authenticate");

  const row = db
    .query<RecipeRow, [string, string]>(
      "SELECT id, title, ingredients, method, created_at, image_url FROM recipes WHERE id = ? AND user_id = ?"
    )
    .get(id, session.user.id);

  if (!row) notFound();

  let ingredients: Ingredient[] = [];
  try {
    ingredients = JSON.parse(row.ingredients);
  } catch {
    /* leave empty */
  }

  let method: object = {};
  try {
    method = JSON.parse(row.method);
  } catch {
    /* leave empty */
  }

  return (
    <div className="max-w-2xl">
      <StaggerContainer>
        {row.image_url && (
          <StaggerItem className="mb-8 w-full overflow-hidden rounded-xl" style={{ height: "320px" }}>
            <img
              src={row.image_url}
              alt={row.title}
              className="h-full w-full object-cover"
            />
          </StaggerItem>
        )}

        <StaggerItem variant="heading" className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/recipes"
              className="text-sm text-zinc-500 transition-colors hover:text-zinc-700"
            >
              ← Recipes
            </Link>
            <h1 className="text-2xl font-semibold text-zinc-900">{row.title}</h1>
          </div>
          <Link
            href={`/recipes/${id}/edit`}
            className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-300 hover:bg-zinc-50"
          >
            Edit
          </Link>
        </StaggerItem>

        <StaggerItem className="mb-8">
          <section>
            <h2 className="mb-3 text-base font-semibold text-zinc-900">Ingredients</h2>
            <ul className="flex flex-col gap-1.5">
              {ingredients.map((item, i) => (
                <li key={`${item.name}-${i}`} className="flex gap-4 text-sm text-zinc-700">
                  <span className="flex-1">{item.name}</span>
                  <span className="text-zinc-400">{item.quantity}</span>
                </li>
              ))}
            </ul>
          </section>
        </StaggerItem>

        <StaggerItem>
          <section>
            <h2 className="mb-3 text-base font-semibold text-zinc-900">Method</h2>
            <RecipeMethodRenderer content={method} />
          </section>
        </StaggerItem>
      </StaggerContainer>
    </div>
  );
}
