"use client";

export type Ingredient = { name: string; quantity: string };

type Props = {
  value: Ingredient[];
  onChange: (ingredients: Ingredient[]) => void;
};

const inputClass =
  "rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus-visible:border-zinc-500 focus-visible:ring-2 focus-visible:ring-zinc-200";

export default function IngredientsEditor({
  value,
  onChange,
}: Props): React.JSX.Element {
  function handleNameChange(index: number, name: string): void {
    onChange(value.map((item, i) => (i === index ? { ...item, name } : item)));
  }

  function handleQuantityChange(index: number, quantity: string): void {
    onChange(
      value.map((item, i) => (i === index ? { ...item, quantity } : item))
    );
  }

  function handleRemove(index: number): void {
    onChange(value.filter((_, i) => i !== index));
  }

  function handleAdd(): void {
    onChange([...value, { name: "", quantity: "" }]);
  }

  return (
    <div className="flex flex-col gap-2">
      {value.map((ingredient, index) => (
        <div key={index} className="flex gap-2">
          <input
            type="text"
            value={ingredient.name}
            onChange={(e) => handleNameChange(index, e.target.value)}
            placeholder="Ingredient name"
            aria-label={`Ingredient ${index + 1} name`}
            className={`${inputClass} min-w-0 flex-1`}
          />
          <input
            type="text"
            value={ingredient.quantity}
            onChange={(e) => handleQuantityChange(index, e.target.value)}
            placeholder="Amount"
            aria-label={`Ingredient ${index + 1} quantity`}
            className={`${inputClass} w-28 shrink-0`}
          />
          <button
            type="button"
            onClick={() => handleRemove(index)}
            aria-label={`Remove ingredient ${index + 1}`}
            disabled={value.length === 1}
            className="shrink-0 rounded-lg px-2 py-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            ✕
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={handleAdd}
        className="self-start text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900"
      >
        + Add ingredient
      </button>
    </div>
  );
}
