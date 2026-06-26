"use client";

import { useRef, useState, useTransition } from "react";
import { uploadRecipeImage } from "@/lib/recipes/upload-action";

type Props = {
  recipeId: string;
  currentImageUrl: string | null;
};

export default function RecipeImageUpload({
  recipeId,
  currentImageUrl,
}: Props): React.JSX.Element {
  const [isPending, startTransition] = useTransition();
  const [preview, setPreview] = useState<string | null>(currentImageUrl);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File): void {
    setError(null);
    setPreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("image", file);

    startTransition(async () => {
      const result = await uploadRecipeImage(recipeId, formData);
      if (result.error) {
        setError(result.error);
        setPreview(currentImageUrl);
      }
    });
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>): void {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>): void {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(): void {
    setIsDragging(false);
  }

  return (
    <div className="mb-6">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleInputChange}
      />

      <div
        onClick={() => !isPending && inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative w-full cursor-pointer overflow-hidden rounded-xl border-2 border-dashed transition-colors
          ${isDragging ? "border-zinc-600 bg-zinc-100" : "border-zinc-300 hover:border-zinc-500"}
          ${isPending ? "cursor-wait opacity-70" : ""}`}
        style={{ height: "220px" }}
      >
        {preview ? (
          <>
            <img
              src={preview}
              alt="Recipe photo"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 flex items-end justify-end bg-gradient-to-t from-black/30 to-transparent p-3">
              <span className="rounded-lg bg-zinc-900/80 px-3 py-1.5 text-xs font-medium text-white">
                {isPending ? "Uploading…" : "Change photo"}
              </span>
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-zinc-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="opacity-50"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <p className="text-sm font-medium">
              {isPending ? "Uploading…" : "Drag photo here or click to select"}
            </p>
            <p className="text-xs opacity-60">JPEG, PNG, WebP · max 5 MB</p>
          </div>
        )}
      </div>

      {error && (
        <p role="alert" className="mt-1.5 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
