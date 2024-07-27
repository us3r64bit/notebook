import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { useRef, useState } from "react";
import { Banner } from "./Banner";
import { Skeleton } from "@/components/ui/skeleton";

interface TitleProps {
  initialData: Doc<"documents">;
}

export const Title = ({ initialData }: TitleProps) => {
  const update = useMutation(api.documents.update);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(initialData?.title || "New Note");

  const enableInput = () => {
    setTitle(initialData?.title);
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(0, inputRef.current.value.length);
    }, 0);
  };

  const disableInput = () => {
    setIsEditing(false);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    update({
      id: initialData._id,
      title: e?.target.value || "New Note",
    });
  };
  const keyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      disableInput();
    }
  };
  return (
    <>
      <div className="flex items-center gap-x-1">
        {!!initialData?.icon && <p>{initialData.icon}</p>}
        {isEditing ? (
          <Input
            onClick={() => enableInput()}
            onBlur={() => disableInput()}
            onKeyDown={(e) => keyDown(e)}
            onChange={(e) => onChange(e)}
            value={title}
            className="h-7 px-2 focus-visible:ring-transparent"
          />
        ) : (
          <Button
            onClick={() => enableInput()}
            variant={"ghost"}
            size={"sm"}
            className="font-normal h-auto p-2"
          >
            <span className="truncate">{initialData.title}</span>
          </Button>
        )}
      </div>
    </>
  );
};

Title.Skeleton = function TitleSkeleton() {
  return <Skeleton className="h-6 w-16 rounded-md" />;
};
