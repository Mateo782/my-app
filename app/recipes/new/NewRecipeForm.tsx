"use client";

import { useState } from "react";
import { useActionState } from "react";
import { createRecipe, type ActionState } from "./actions";
import IngredientsEditor, {
  type Ingredient,
} from "@/components/IngredientsEditor";
import RichTextEditor from "@/components/RichTextEditor";
import StaggerItem from "@/components/motion/StaggerItem";

const labelClass = "text-sm font-medium text-zinc-700";
const inputClass =
  "w-full rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus-visible:border-zinc-500 focus-visible:ring-2 focus-visible:ring-zinc-200";

export default function NewRecipeForm(): React.JSX.Element {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    createRecipe,
    null
  );
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { name: "", quantity: "" },
  ]);
  const [methodJson, setMethodJson] = useState<object>({});

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {state?.error && (
        <StaggerItem>
          <p role="alert" className="text-sm text-red-600">
            {state.error}
          </p>
        </StaggerItem>
      )}

      <StaggerItem className="flex flex-col gap-1.5">
        <label htmlFor="title" className={labelClass}>
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          maxLength={200}
          placeholder="e.g. Classic Tomato Pasta"
          className={inputClass}
        />
      </StaggerItem>

      <StaggerItem className="flex flex-col gap-1.5">
        <span className={labelClass}>Ingredients</span>
        <IngredientsEditor value={ingredients} onChange={setIngredients} />
        <input
          type="hidden"
          name="ingredients"
          value={JSON.stringify(ingredients)}
        />
      </StaggerItem>

      <StaggerItem className="flex flex-col gap-1.5">
        <span className={labelClass}>Method</span>
        <RichTextEditor onChange={setMethodJson} />
        <input
          type="hidden"
          name="method"
          value={JSON.stringify(methodJson)}
        />
      </StaggerItem>

      <StaggerItem>
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-zinc-50 transition-colors hover:bg-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? "Saving…" : "Save recipe"}
        </button>
      </StaggerItem>
    </form>
  );
}
