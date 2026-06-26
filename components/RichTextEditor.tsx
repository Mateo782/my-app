"use client";

import { useEditor, EditorContent, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

type Props = {
  initialContent?: object;
  onChange: (json: object) => void;
};

type ToolbarButtonProps = {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  label: string;
  children: React.ReactNode;
};

function ToolbarButton({
  onClick,
  active,
  disabled,
  label,
  children,
}: ToolbarButtonProps): React.JSX.Element {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
      aria-label={label}
      className={`rounded px-2 py-1 text-sm font-medium transition-colors
        ${
          active
            ? "bg-zinc-900 text-zinc-50"
            : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
        }
        disabled:cursor-not-allowed disabled:opacity-40`}
    >
      {children}
    </button>
  );
}

export default function RichTextEditor({
  initialContent,
  onChange,
}: Props): React.JSX.Element {
  const editor = useEditor({
    extensions: [StarterKit.configure({ heading: { levels: [1, 2, 3] } })],
    content: initialContent,
    immediatelyRender: false,
    onUpdate: ({ editor }) => onChange(editor.getJSON()),
  });

  const state = useEditorState({
    editor,
    selector: (ctx) => ({
      bold: ctx.editor?.isActive("bold") ?? false,
      italic: ctx.editor?.isActive("italic") ?? false,
      h1: ctx.editor?.isActive("heading", { level: 1 }) ?? false,
      h2: ctx.editor?.isActive("heading", { level: 2 }) ?? false,
      h3: ctx.editor?.isActive("heading", { level: 3 }) ?? false,
      code: ctx.editor?.isActive("code") ?? false,
      codeBlock: ctx.editor?.isActive("codeBlock") ?? false,
      bulletList: ctx.editor?.isActive("bulletList") ?? false,
      canUndo: ctx.editor?.can().undo() ?? false,
      canRedo: ctx.editor?.can().redo() ?? false,
    }),
  });

  return (
    <div className="overflow-hidden rounded-lg border border-zinc-300">
      <div className="flex flex-wrap gap-0.5 border-b border-zinc-200 bg-zinc-50 p-1.5">
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleBold().run()}
          active={state?.bold}
          label="Bold"
        >
          <strong>B</strong>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          active={state?.italic}
          label="Italic"
        >
          <em>I</em>
        </ToolbarButton>
        <span className="mx-1 w-px self-stretch bg-zinc-200" />
        <ToolbarButton
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 1 }).run()
          }
          active={state?.h1}
          label="Heading 1"
        >
          H1
        </ToolbarButton>
        <ToolbarButton
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 2 }).run()
          }
          active={state?.h2}
          label="Heading 2"
        >
          H2
        </ToolbarButton>
        <ToolbarButton
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 3 }).run()
          }
          active={state?.h3}
          label="Heading 3"
        >
          H3
        </ToolbarButton>
        <span className="mx-1 w-px self-stretch bg-zinc-200" />
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleCode().run()}
          active={state?.code}
          label="Inline code"
        >
          {"<>"}
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
          active={state?.codeBlock}
          label="Code block"
        >
          {"</>"}
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          active={state?.bulletList}
          label="Bullet list"
        >
          ≡
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor?.chain().focus().setHorizontalRule().run()}
          label="Horizontal rule"
        >
          —
        </ToolbarButton>
        <span className="mx-1 w-px self-stretch bg-zinc-200" />
        <ToolbarButton
          onClick={() => editor?.chain().focus().undo().run()}
          disabled={!state?.canUndo}
          label="Undo"
        >
          ↩
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor?.chain().focus().redo().run()}
          disabled={!state?.canRedo}
          label="Redo"
        >
          ↪
        </ToolbarButton>
      </div>
      <EditorContent
        editor={editor}
        className="prose prose-zinc max-w-none px-3 py-2 text-sm dark:prose-invert [&_.ProseMirror]:min-h-[120px] [&_.ProseMirror]:outline-none"
      />
    </div>
  );
}
