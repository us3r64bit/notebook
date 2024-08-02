"user client";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface BannerProps {
  documentId: Id<"documents">;
}
export const Banner = ({ documentId }: BannerProps) => {
  const remove = useMutation(api.documents.remove);
  const restore = useMutation(api.documents.restore);
  const router = useRouter();

  const onRemove = () => {
    const promise = remove({ id: documentId });
    toast.promise(promise, {
      loading: "Deleting note...",
      success: "Note Deleted Forever!",
      error: " Failed to Delete note.",
    });
    router.push("/documents");
  };
  const onRestore = () => {
    const promise = restore({ id: documentId });
    toast.promise(promise, {
      loading: "Restoring note...",
      success: "Note restored!",
      error: " Failed to restore note.",
    });
  };
  return (
    <div className="flex bg-red-500 justify-center items-center text-sm p-2 text-white gap-x-2">
      <p>This note is in Archived.</p>
      <Button
        size={"sm"}
        onClick={() => onRestore()}
        className="h-auto border-white bg-transparent p-1 px-2 font-normal text-white hover:bg-primary/5 hover:text-white"
        variant={"outline"}
      >
        Restore Note
      </Button>
      <Button
        onClick={() => onRemove()}
        className="h-auto border-white bg-transparent p-1 px-2 font-normal text-white hover:bg-primary/5 hover:text-white"
        variant={"outline"}
      >
        Delete Forever
      </Button>
    </div>
  );
};
