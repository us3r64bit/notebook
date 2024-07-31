"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { useMutation } from "convex/react";
import {
    ChevronDown,
    ChevronRight,
    LucideIcon,
    Plus,
    Trash2Icon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ListItemProps {
    id?: Id<"documents">;
    documentIcon?: string;
    active?: boolean;
    expanded?: boolean;
    isSearch?: boolean;
    level?: number;
    onExpand?: () => void;
    label: string;
    onClick?: () => void;
    icon: LucideIcon;
}

const ListItem = ({
    id,
    label,
    onClick,
    icon: Icon,
    active,
    documentIcon,
    level = 0,
    isSearch,
    onExpand,
    expanded,
}: ListItemProps) => {
    const create = useMutation(api.documents.create);
    const router = useRouter();
    const ChevronIcon = expanded ? ChevronDown : ChevronRight;
    const archived = useMutation(api.documents.archived);

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

    const handleCreate = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    ) => {
        event.preventDefault();
        event.stopPropagation();
        if (!id) return;
        const promise = create({ title: "New Note", parentDocument: id }).then(
            (documentId) => {
                if (!expanded) {
                    onExpand?.();
                }
                router.push(`/documents/${documentId}`);
            },
        );
        toast.promise(promise, {
            loading: "Moving to Archived...",
            success: "Note Moved to Archived!",
            error: "Failed to Move in Archived.",
        });
    };
    return (
        <div
            onClick={onClick}
            role="button"
            style={{ paddingLeft: level ? `${level * 12 + 12}px` : "12px" }}
            className={cn(
                "group flex min-h-[27px] w-full items-center py-1 pr-3 text-sm font-medium text-muted-foreground hover:bg-primary/5",
                active && "bg-primary/5 text-primary",
            )}
        >
            {!!id && (
                <div
                    onClick={(e) => handleExpand(e)}
                    role="button"
                    className="mr-1 h-full rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
                >
                    <ChevronIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
                </div>
            )}

            {documentIcon ? (
                <div className="mr-2 shrink-0 text-[18px]">{documentIcon}</div>
            ) : (
                <Icon className="mr-1 h-[18px] w-[18px] shrink-0 text-muted-foreground" />
            )}
            <span className="truncate">{label}</span>
            {isSearch && (
                <kbd className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                    ctrl + K
                </kbd>
            )}
            {!!id && (
                <div className="ml-auto flex items-center gap-x-2">
                    <div
                        role="button"
                        onClick={(e) => handleCreate(e)}
                        className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-200 dark:hover:bg-neutral-600"
                    >
                        <Plus className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div
                        role="button"
                        onClick={(e) => handleArchived(e)}
                        className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-200 dark:hover:bg-neutral-600"
                    >
                        <Trash2Icon className="h-4 w-4 text-muted-foreground hover:text-red-500" />
                    </div>
                </div>
            )}
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
