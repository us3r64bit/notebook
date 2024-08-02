"use client";

import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import ListItem from "./ListItem";
import { cn } from "@/lib/utils";
import { FileIcon } from "lucide-react";

interface ListViewProps {
  parentDocumentId?: Id<"documents">;
  level?: number;
  data?: Doc<"documents">[];
}

export const ListView = ({ parentDocumentId, level = 0 }: ListViewProps) => {
  const params = useParams();
  const router = useRouter();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const onExpand = (documentId: string) => {
    setExpanded((prevDocument) => ({
      ...prevDocument,
      [documentId]: !prevDocument[documentId],
    }));
  };

  const documents = useQuery(api.documents.getBookmarks, {
    parentDocument: parentDocumentId,
  });

  const onRedirect = (documentId: string) => {
    router.push(`/documents/${documentId}`);
  };

  if (documents === undefined) {
    return (
      <>
        <ListItem.Skeleton level={level} />
        {level === 0 && (
          <>
            <ListItem.Skeleton level={level} />
            <ListItem.Skeleton level={level} />
          </>
        )}
      </>
    );
  }
  return (
    <>
      <p
        style={{ paddingLeft: level ? `${level * 12 + 25}px` : undefined }}
        className={cn(
          "hidden text-sm font-medium text-muted-foreground/80",
          expanded && "last:block",
          level === 0 && "hidden",
        )}
      >
        No pages inside
      </p>

      {documents.map((document) => (
        <div key={document._id}>
          <ListItem
            id={document._id}
            bookmarked={document.isBookmarked}
            onClick={() => onRedirect(document._id)}
            label={document.title}
            icon={FileIcon}
            documentIcon={document.icon}
            active={params.documentId === document._id}
            level={level}
            onExpand={() => onExpand(document._id)}
            expanded={expanded[document._id]}
          />
          {expanded[document._id] && (
            <ListView parentDocumentId={document._id} level={level + 1} />
          )}
        </div>
      ))}
    </>
  );
};
