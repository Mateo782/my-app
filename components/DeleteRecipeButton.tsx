"use client";

import { useTransition } from "react";
import { deleteRecipe } from "@/app/recipes/actions";

type Props = { id: string };

export default function DeleteRecipeButton({ id }: Props): React.JSX.Element {
  const [isPending, startTransition] = useTransition();

  function handleClick(): void {
    if (!window.confirm("Delete this recipe? This cannot be undone.")) return;
    startTransition(() => deleteRecipe(id));
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      aria-label="Delete recipe"
      className="rounded-lg px-3 py-1.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-red-950 dark:hover:text-red-400"
    >
      {isPending ? "…" : "Delete"}
    </button>
  );
}
