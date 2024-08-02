import Image from "next/image";
import { Button } from "./ui/button";
import { ImageIcon, X } from "lucide-react";
import { useCoverImage } from "@/hooks/useCoverImage";
import { cn } from "@/lib/utils";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useParams } from "next/navigation";
import { useEdgeStore } from "@/lib/edgestore";
import { Skeleton } from "./ui/skeleton";
import ImageDraggable from "./ImageDraggable";
import { useState } from "react";

interface CoverImageProps {
  url?: string;
  preview?: boolean;
}

export const Cover = ({ url, preview }: CoverImageProps) => {
  const removeCover = useMutation(api.documents.removeCover);
  const coverImage = useCoverImage();
  const params = useParams();
  const { edgestore } = useEdgeStore();

  const [isDraggable, setIsDraggable] = useState(false);
  const handlePosition = (e: any) => {
    console.log(e);
    setIsDraggable(true);
  };

  const handleSave = () => {
    setIsDraggable(false);
  };
  const onCoverRemove = async () => {
    removeCover({
      id: params.documentId as Id<"documents">,
    });
    await edgestore.publicFiles.delete({
      url: url || "",
    });
  };

  return (
    <div
      className={cn(
        "group relative h-[35vh] w-full",
        !url && "h-[12vh]",
        url && "bg-muted",
      )}
    >
      {/* {!!url && <ImageDraggable url={url} isDraggable={isDraggable} />} */}
      {!!url && <Image src={url} fill alt="Cover" className="object-cover" />}

      {url && !preview && (
        <div className="absolute bottom-5 right-5 z-50 flex items-center gap-x-2 opacity-0 group-hover:opacity-100">
          <Button
            onClick={() => coverImage.onChange(url)}
            className="text-xs text-muted-foreground"
            variant="outline"
            size="sm"
          >
            <ImageIcon className="mr-2 h-4 w-4" />
            Change cover
          </Button>
          <Button
            onClick={() => onCoverRemove()}
            className="group/label text-xs text-muted-foreground"
            variant="outline"
            size="sm"
          >
            <X className="h-4 w-4" />
            <span className="ml-2 hidden transition group-hover/label:block">
              Remove
            </span>
          </Button>
          <Button
            onClick={handleSave}
            className="group/label text-xs text-muted-foreground"
            variant="outline"
            size="sm"
          >
            Save
          </Button>
          <Button
            onClick={handlePosition}
            className="group/label text-xs text-muted-foreground"
            variant="outline"
            size="sm"
          >
            Position
          </Button>
        </div>
      )}
    </div>
  );
};

Cover.Skeleton = function CoverImageModalSkeleton() {
  return <Skeleton className="w-full h-[12vh]" />;
};
