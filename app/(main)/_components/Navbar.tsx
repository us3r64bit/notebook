"use client";

import { useMutation, useQuery } from "convex/react";
import { useParams } from "next/navigation";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Title } from "./Title";
import { Banner } from "./Banner";
import { Bookmark, MenuIcon } from "lucide-react";
import { Menu } from "./Menu";
import { Publish } from "./Publish";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface NavbarProps {
  isCollapsed: boolean;
  onResetWidth: () => void;
}

function Navbar({ isCollapsed, onResetWidth }: NavbarProps) {
  const params = useParams();
  const update = useMutation(api.documents.update);
  const document = useQuery(api.documents.getById, {
    documentId: params.documentId as Id<"documents">,
  });

  const toggleBookmark = () => {
    const bookmarked = !document?.isBookmarked;
    const promise = update({
      id: params.documentId as Id<"documents">,
      isBookmarked: bookmarked,
    });
    if (bookmarked) {
      toast.promise(promise, {
        loading: "Adding document in Bookmarks",
        success: "Added document in Bookmarks",
        error: "Failed to add in Bookmarks",
      });
    } else {
      toast.promise(promise, {
        loading: "Removing document from Bookmarks",
        success: "Removed document from Bookmarks",
        error: "Failed to remove from Bookmarks",
      });
    }
  };

  if (document === undefined) {
    return (
      <div className="flex w-full items-center justify-between bg-background px-3 py-2 dark:bg-[#1f1f1f] mt-1">
        <Title.Skeleton />
        <div className="flex items-center gap-x-2">
          <Menu.Skeleton />
        </div>
      </div>
    );
  }

  if (document === null) {
    return null;
  }
  return (
    <>
      <nav className="flex w-full items-center gap-x-4 bg-background px-3 py-2 dark:bg-[#1f1f1f]">
        {isCollapsed && (
          <MenuIcon
            role="button"
            onClick={onResetWidth}
            className="h-6 w-6 text-muted-foreground"
          />
        )}
        <div className="flex w-full items-center justify-between">
          <Title initialData={document} />
          <div className="flex items-center gap-x-2">
            <Publish initialData={document} />
            <Bookmark
              className={cn(
                "w-4 h-4 hover:fill-black",
                document?.isBookmarked && "fill-black",
              )}
              role="button"
              onClick={() => toggleBookmark()}
            />
            <Menu documentId={document._id} />
          </div>
        </div>
      </nav>
      {document.isArchived && <Banner documentId={document._id} />}
    </>
  );
}

export default Navbar;
