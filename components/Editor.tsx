"use client";

import { useCreateBlockNote } from "@blocknote/react";
import "@blocknote/core/style.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useTheme } from "next-themes";
import { BlockNoteEditor, PartialBlock } from "@blocknote/core";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useEdgeStore } from "@/lib/edgestore";

interface EditorProps {
  documentId: string;
  initialContent?: string;
  editable?: boolean;
}
const Editor = ({ documentId, initialContent, editable }: EditorProps) => {
  const update = useMutation(api.documents.update);
  const { edgestore } = useEdgeStore();
  const { resolvedTheme } = useTheme();

  const handleUpload = async (file: File) => {
    const response = await edgestore.publicFiles.upload({
      file,
    });
    return response.url;
  };
  const editor: BlockNoteEditor = useCreateBlockNote({
    initialContent: initialContent
      ? (JSON.parse(initialContent) as PartialBlock[])
      : undefined,
    uploadFile: handleUpload,
  });
  const onChange = () => {
    update({
      id: documentId as Id<"documents">,
      content: JSON.stringify(editor.document, null, 2),
    });
  };
  const theme = resolvedTheme === "dark" ? "dark" : "light";

  return (
    <BlockNoteView
      editor={editor}
      theme={theme}
      onChange={onChange}
      editable={editable}
    />
  );
};

export default Editor;
