"use client";

import { useQuery } from "convex/react";
import { useParams } from "next/navigation";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface NavbarProps {
  isCollapsed: boolean;
  onResetWidth: () => void;
}

function Navbar({ isCollapsed, onResetWidth }: NavbarProps) {
  const params = useParams();
  const document = useQuery(api.documents.getById, {
    documentId: params.documentId as Id<"documents">,
  });

  if (document === undefined) {
    return (
      <div className="flex w-full items-center justify-between bg-background px-3 py-2 dark:bg-[#1f1f1f] mt-1">
        Title
      </div>
    );
  }

  if (document === null) {
    return null;
  }
  return (
    <>
      <nav className="flex w-full items-center gap-x-4 bg-background px-3 py-2 dark:bg-[#1f1f1f]">
        Navbar
      </nav>
    </>
  );
}

export default Navbar;