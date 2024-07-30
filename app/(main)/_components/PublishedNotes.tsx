"user client";

import { Spinner } from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type DocumentType = {
  [documentId: string]: boolean | undefined;
};
export const PublishedNotes = () => {
  const publishDocuments = useQuery(api.documents.getPublished);
  const unPublishAll = useMutation(api.documents.unpublishAll);
  const [search, setSearch] = useState("");
  const router = useRouter();
  const [selectedDocuments, setSelectedDocuments] = useState<DocumentType>({});

  const filteredPublishDocuments = publishDocuments?.filter((item) =>
    item.title.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
  );

  const handleOnChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    documentId: string,
  ) => {
    const { checked } = e.target;
    setSelectedDocuments({
      ...selectedDocuments,
      [documentId]: checked,
    });
  };
  const handleUnpublishAll = () => {
    const trueValues = Object.keys(selectedDocuments).filter(
      (key) => selectedDocuments[key] === true,
    );
    const promise = unPublishAll({ documentIds: trueValues });
    toast.promise(promise, {
      loading: "Unpublishing Selected Documents",
      success: "Unpublished Selected Docuemnts",
      error: "Failed Unpublished Selected Docuemnts",
    });
  };

  if (!publishDocuments) {
    return <Spinner size={"lg"} />;
  }
  return (
    <div className="text-sm">
      <div className="flex items-center gap-x-1 p-2">
        <Search className="h-6 w-6" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-7 px-2 focus-visible:ring-transparent bg-secondary"
          placeholder="Filter by page title..."
        />
        <Button
          variant={"outline"}
          size={"sm"}
          className="dark:border-white"
          onClick={() => handleUnpublishAll()}
        >
          Unpublish
        </Button>
      </div>
      <div className="mt-2 px-1 pb-1">
        <p className="hidden last:block text-xs text-center text-muted-foreground pb-2">
          No published document.
        </p>
        <div className="w-full text-sm font-medium text-gray-900 rounded-lg dark:text-white">
          {filteredPublishDocuments?.map((document) => (
            <div
              key={document._id}
              className="rounded-t-lg flex items-center justify-between w-full px-3"
              role="button"
              onClick={() => {
                router.push(`/documents/${document._id}`);
              }}
            >
              <label className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                {document.title}
              </label>
              <input
                type="checkbox"
                value={document.title}
                className="w-4 h-4 text-blue-600 bg-gray-100 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2"
                onChange={(e) => handleOnChange(e, document._id)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
