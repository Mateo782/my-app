import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import db from "@/lib/db";
import DeleteRecipeButton from "@/components/DeleteRecipeButton";
import StaggerContainer from "@/components/motion/StaggerContainer";
import StaggerItem from "@/components/motion/StaggerItem";

type Recipe = { id: string; title: string; created_at: string };

export default async function RecipesPage(): Promise<React.JSX.Element> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/authenticate");

  const recipes = db
    .query<Recipe, [string]>(
      "SELECT id, title, created_at FROM recipes WHERE user_id = ? ORDER BY created_at DESC"
    )
    .all(session.user.id);

  return (
    <StaggerContainer>
      <StaggerItem variant="heading" className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-zinc-900">My Recipes</h1>
        <Link
          href="/recipes/new"
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-50 transition-colors hover:bg-zinc-700"
        >
          New Recipe
        </Link>
      </StaggerItem>

      {recipes.length === 0 ? (
        <StaggerItem className="flex flex-col items-center gap-3 py-24 text-center">
          <p className="text-zinc-500">No recipes yet.</p>
          <Link
            href="/recipes/new"
            className="text-sm font-medium text-zinc-900 underline-offset-4 hover:underline"
          >
            Create your first one →
          </Link>
        </StaggerItem>
      ) : (
        <>
          {recipes.map((recipe) => (
            <StaggerItem key={recipe.id} className="mb-3">
              <div className="flex items-center rounded-xl border border-zinc-200 bg-zinc-50 transition-colors hover:border-zinc-300">
                <Link
                  href={`/recipes/${recipe.id}`}
                  className="flex flex-1 items-center justify-between px-5 py-4 hover:bg-zinc-50 rounded-l-xl"
                >
                  <span className="font-medium text-zinc-900">{recipe.title}</span>
                  <span className="text-sm text-zinc-400">
                    {new Date(recipe.created_at).toLocaleDateString("de-DE")}
                  </span>
                </Link>
                <div className="flex shrink-0 items-center gap-1 border-l border-zinc-100 px-3">
                  <Link
                    href={`/recipes/${recipe.id}/edit`}
                    className="rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
                  >
                    Edit
                  </Link>
                  <DeleteRecipeButton id={recipe.id} />
                </div>
              </div>
            </StaggerItem>
          ))}
        </>
      )}
    </StaggerContainer>
  );
}
