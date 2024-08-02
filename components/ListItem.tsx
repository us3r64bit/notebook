"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { useMutation } from "convex/react";
import {
  Bookmark,
  ChevronDown,
  ChevronRight,
  LucideIcon,
  Trash2Icon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ListItemProps {
  id: Id<"documents">;
  documentIcon?: string;
  active?: boolean;
  expanded?: boolean;
  level?: number;
  onExpand?: () => void;
  label: string;
  onClick?: () => void;
  icon: LucideIcon;
  bookmarked?: boolean;
}

const ListItem = ({
  id,
  label,
  onClick,
  icon: Icon,
  active,
  documentIcon,
  level = 0,
  onExpand,
  expanded,
  bookmarked,
}: ListItemProps) => {
  const archived = useMutation(api.documents.archived);
  const update = useMutation(api.documents.update);
  const router = useRouter();
  const ChevronIcon = expanded ? ChevronDown : ChevronRight;

  const handleExpand = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    onExpand?.();
  };

  const handleArchived = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    if (!id) return;
    const promise = archived({ id: id });
    toast.promise(promise, {
      loading: "Creating a new note...",
      success: "New note created!",
      error: "Failed to create a note.",
    });
    router.push(`/documents`);
  };

  const handleUnBookmark = () => {
    const promise = update({
      id: id,
      isBookmarked: false,
    });
    toast.promise(promise, {
      loading: "Removing document from Bookmarks",
      success: "Removed document from Bookmarks",
      error: "Failed to remove from Bookmarks",
    });
  };

  return (
    <div
      onClick={onClick}
      role="button"
      style={{ paddingLeft: level ? `${level * 12 + 12}px` : "12px" }}
      className={cn(
        "group flex min-h-[27px] w-full items-center py-2 pr-3 text-sm font-medium text-muted-foreground hover:bg-primary/5",
        active && "bg-primary/5 text-primary",
      )}
    >
      <div
        onClick={(e) => handleExpand(e)}
        role="button"
        className="mr-1 h-full rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
      >
        <ChevronIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
      </div>

      {documentIcon ? (
        <div className="mr-2 shrink-0 text-[18px]">{documentIcon}</div>
      ) : (
        <Icon className="mr-1 h-[18px] w-[18px] shrink-0 text-muted-foreground" />
      )}

      <span className="truncate">{label}</span>
      <div className="ml-auto flex items-center gap-x-2 mr-8">
        <div
          role="button"
          onClick={(e) => {}}
          className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-200 dark:hover:bg-neutral-600"
        >
          <Bookmark
            className={cn(
              "w-4 h-4 hover:fill-black",
              bookmarked && "fill-black hover:opacity-60",
            )}
            role="button"
            onClick={() => handleUnBookmark()}
          />
        </div>
        <div
          role="button"
          onClick={(e) => handleArchived(e)}
          className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-200 dark:hover:bg-neutral-600"
        >
          <Trash2Icon className="h-4 w-4 text-muted-foreground hover:text-red-500" />
        </div>
      </div>
    </div>
  );
};

ListItem.Skeleton = function ListItemSkeleton({ level }: { level?: number }) {
  return (
    <div
      style={{
        paddingLeft: level ? `${level * 12 + 25}px` : "12px",
      }}
      className="flex gap-x-2 py-[3px]"
    >
      <Skeleton className="h-4 w-4 " />
      <Skeleton className="h-4 w-[30%]" />
    </div>
  );
};

export default ListItem;
