"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

type Props = { content: object };

export default function RecipeMethodRenderer({
  content,
}: Props): React.JSX.Element {
  const doc = content as Record<string, unknown>;
  const isValidDoc = doc.type === "doc";

  const editor = useEditor({
    extensions: [StarterKit],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    content: isValidDoc ? (content as any) : undefined,
    editable: false,
    immediatelyRender: false,
  });

  if (!isValidDoc) {
    return (
      <p className="text-sm italic text-zinc-500">No method recorded.</p>
    );
  }

  return (
    <EditorContent
      editor={editor}
      className="prose prose-zinc max-w-none text-sm dark:prose-invert [&_.ProseMirror]:outline-none"
    />
  );
}
