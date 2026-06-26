import Link from "next/link";
import NewRecipeForm from "./NewRecipeForm";
import StaggerContainer from "@/components/motion/StaggerContainer";
import StaggerItem from "@/components/motion/StaggerItem";

export default function NewRecipePage(): React.JSX.Element {
  return (
    <div className="max-w-2xl">
      <StaggerContainer>
        <StaggerItem variant="heading" className="mb-8 flex items-center gap-3">
          <Link
            href="/recipes"
            className="text-sm text-zinc-500 transition-colors hover:text-zinc-700"
          >
            ← Recipes
          </Link>
          <h1 className="text-2xl font-semibold text-zinc-900">New Recipe</h1>
        </StaggerItem>
        {/* Form fields are StaggerItems too — variants propagate through <form> */}
        <NewRecipeForm />
      </StaggerContainer>
    </div>
  );
}
