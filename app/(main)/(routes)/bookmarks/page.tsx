"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import Image from "next/image";
import { DocumentList } from "../../_components/DocumentList";

const BookmarksPage = () => {
    const bookmarks = useQuery(api.documents.getBookmarks);
    return (
        <>

            {
                !bookmarks && (
                    <div className="flex h-full flex-col items-center justify-center space-y-4">
                        <Image
                            src="/bookmarks.png"
                            height={500}
                            width={500}
                            className="dark:hidden"
                            alt="Create Note"
                        />
                        <Image
                            src="/bookmarks-dark-dark.png"
                            height={500}
                            width={500}
                            className="hidden dark:block"
                            alt="Create Note"
                        />
                        <h2 className="text-lg font-medium text-muted-foreground">
                            {"No Bookmarks founded"}
                        </h2>
                    </div>
                )
            }
            {
                // PUT some image here to push list little bit lower.
                !!bookmarks && <DocumentList />
            }
        </>
    );
};

export default BookmarksPage;
