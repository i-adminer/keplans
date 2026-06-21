"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Heading3,
  Undo,
  Redo,
} from "lucide-react";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({
  content,
  onChange,
  placeholder = "Start typing...",
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "tiptap prose prose-sm max-w-none min-h-[200px] px-3 py-2 focus:outline-none",
      },
    },
  });

  if (!editor) return null;

  return (
    <div className="rounded-lg border border-border bg-background">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 border-b border-border p-2">
        {/* Undo / Redo */}
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          className="rounded p-2 hover:bg-accent disabled:opacity-30"
          title="Undo"
        >
          <Undo className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          className="rounded p-2 hover:bg-accent disabled:opacity-30"
          title="Redo"
        >
          <Redo className="size-4" />
        </button>

        <div className="w-px bg-border" />

        {/* Headings */}
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`rounded p-2 hover:bg-accent ${editor.isActive("heading", { level: 2 }) ? "bg-accent" : ""}`}
          title="Heading 2"
        >
          <Heading2 className="size-4" />
        </button>
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={`rounded p-2 hover:bg-accent ${editor.isActive("heading", { level: 3 }) ? "bg-accent" : ""}`}
          title="Heading 3"
        >
          <Heading3 className="size-4" />
        </button>

        <div className="w-px bg-border" />

        {/* Bold / Italic */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`rounded p-2 hover:bg-accent ${editor.isActive("bold") ? "bg-accent" : ""}`}
          title="Bold"
        >
          <Bold className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`rounded p-2 hover:bg-accent ${editor.isActive("italic") ? "bg-accent" : ""}`}
          title="Italic"
        >
          <Italic className="size-4" />
        </button>

        <div className="w-px bg-border" />

        {/* Lists */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`rounded p-2 hover:bg-accent ${editor.isActive("bulletList") ? "bg-accent" : ""}`}
          title="Bullet List"
        >
          <List className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`rounded p-2 hover:bg-accent ${editor.isActive("orderedList") ? "bg-accent" : ""}`}
          title="Numbered List"
        >
          <ListOrdered className="size-4" />
        </button>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  );
}
