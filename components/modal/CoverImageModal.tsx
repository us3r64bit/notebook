"user client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useCoverImage } from "@/hooks/useCoverImage";
import { SingleImageDropzone } from "../SingleImageDropZone";
import { useState } from "react";
import { useEdgeStore } from "@/lib/edgestore";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";

export const CoverImageModal = () => {
  const update = useMutation(api.documents.update);
  const params = useParams();
  const [file, setFile] = useState<File>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const coverImage = useCoverImage();
  const { edgestore } = useEdgeStore();

  const onClose = () => {
    setFile(undefined);
    setIsSubmitting(false);
    coverImage.onClose();
  };
  const onChange = async (file?: File) => {
    if (file) {
      setFile(file);
      setIsSubmitting(true);
      let res;
      if(coverImage.url){
        res = await edgestore.publicFiles.upload({
          file,
          options: {
            replaceTargetUrl: coverImage.url,
          },
        });
      }
      else{
        res = await edgestore.publicFiles.upload({
          file,
        });
      }
      update({
        id: params.documentId as Id<"documents">,
        coverImage: res?.url,
      });
      onClose();
    }
  };
  return (
    <Dialog open={coverImage.isOpen} onOpenChange={coverImage.onClose}>
      <DialogContent>
        <DialogTitle>
          <h2>Cover Image</h2>
        </DialogTitle>
        <SingleImageDropzone
          className="w-full outline-none"
          onChange={(e) => onChange(e)}
          value={file}
          disabled={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};
