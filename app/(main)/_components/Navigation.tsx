import { ElementRef, useEffect, useRef, useState } from "react";

import {
  Bookmark,
  ChevronLeft,
  GlobeIcon,
  LucideTrash2,
  MenuIcon,
  Plus,
  PlusCircle,
  Search,
  Settings,
} from "lucide-react";
import { useMediaQuery } from "usehooks-ts";
import { cn } from "@/lib/utils";
import UserItem from "./UserItem";
import Item from "./Item";
import { DocumentList } from "./DocumentList";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TrashBox } from "./TrashBox";
import { useSearch } from "@/hooks/useSearch";
import { useSettings } from "@/hooks/useSettings";
import Navbar from "./Navbar";
import { PublishedNotes } from "./PublishedNotes";

const Navigation = () => {
  const isMobile = useMediaQuery("(max-width:768px)");
  const create = useMutation(api.documents.create);
  const router = useRouter();
  const search = useSearch();
  const settings = useSettings();
  const params = useParams();

  const isResizingRef = useRef(false);
  const sidebarRef = useRef<ElementRef<"aside">>(null);
  const navbarRef = useRef<ElementRef<"div">>(null);

  const [isResetting, setIsResetting] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(isMobile);

  useEffect(() => {
    if (isMobile) {
      collapse();
    } else {
      resetWidth();
    }
  }, [isMobile]);

  const handleCreate = () => {
    const promise = create({ title: "New Note" }).then((documentId) => {
      router.push(`/documents/${documentId}`);
    });
    toast.promise(promise, {
      loading: "Creating new note...",
      success: "New note created!",
      error: "Failed to create new note",
    });
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();
    isResizingRef.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizingRef.current) return;
    let changedWidth = e.clientX;

    // limit the max and min width for sidebar
    if (changedWidth < 240) changedWidth = 240;
    if (changedWidth > 480) changedWidth = 480;

    if (sidebarRef.current && navbarRef.current) {
      sidebarRef.current.style.width = `${changedWidth}px`;
      navbarRef.current.style.setProperty("left", `${changedWidth}px`);
      navbarRef.current.style.setProperty(
        "width",
        `calc(100% - ${changedWidth}px)`,
      );
    }
  };
  const handleMouseUp = () => {
    isResizingRef.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const resetWidth = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(false);
      setIsResetting(true);
      sidebarRef.current.style.width = isMobile ? "100%" : "240px";
      navbarRef.current.style.setProperty(
        "width",
        isMobile ? "0" : "calc(100% - 240px)",
      );
      navbarRef.current.style.setProperty("left", isMobile ? "100%" : "240px");
      setTimeout(() => {
        setIsResetting(false);
      }, 300);
    }
  };

  const collapse = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(true);
      setIsResetting(true);
      sidebarRef.current.style.width = "0";
      navbarRef.current.style.setProperty("width", "100%");
      navbarRef.current.style.setProperty("left", "0");
      setTimeout(() => setIsResetting(false), 300);
    }
  };

  return (
    <>
      <aside
        ref={sidebarRef}
        className={cn(
          "group/sidebar h-full bg-secondary overflow-y-auto relative flex w-60 flex-col z-[99999]",
          isResetting && "transition-all duration-300 ease-in-out",
          isMobile && "w-0",
        )}
      >
        <div
          role="button"
          className={cn(
            "absolute right-2 top-3 h-6 w-6 rounded-sm text-muted-foreground opacity-0 transition hover:bg-neutral-300 group-hover/sidebar:opacity-100 dark:hover:bg-neutral-600",
            isMobile && "opacity-100",
          )}
          onClick={() => collapse()}
        >
          <ChevronLeft className="h-6 w-6" />
        </div>
        <div>
          <UserItem />
          <Item
            label="Search"
            icon={Search}
            onClick={() => {
              search.onOpen();
              isMobile ? collapse() : undefined;
            }}
            isSearch={true}
          />
          <Item
            label="Setting"
            icon={Settings}
            onClick={() => {
              settings.onOpen();
              isMobile ? collapse() : undefined;
            }}
          />
          <Item
            label="Bookmarks"
            icon={Bookmark}
            onClick={() => {
              router.push("/bookmarks");
              isMobile ? collapse() : undefined;
            }}
          />
          <Item
            onClick={() => {
              handleCreate();
              isMobile ? collapse() : undefined;
            }}
            icon={PlusCircle}
            label="New Page"
          />
        </div>
        <div className="mt-4">
          <DocumentList />
          <Item
            onClick={() => {
              handleCreate();
              isMobile ? collapse() : undefined;
            }}
            icon={Plus}
            label="New Page"
          />
        </div>
        <div
          onMouseDown={(e) => {
            handleMouseDown(e);
          }}
          onClick={() => {
            resetWidth();
          }}
          className="absolute right-0 top-0 h-full w-1 cursor-ew-resize bg-primary/10 opacity-0 transition group-hover/sidebar:opacity-100"
        />
        <div>
          <Popover>
            <PopoverTrigger className="mt-4 w-full">
              <Item icon={LucideTrash2} label="Trash" />
            </PopoverTrigger>
            <PopoverContent
              className="w-96 p-0 bg-white dark:bg-black dark:text-white"
              side={isMobile ? "bottom" : "right"}
            >
              <TrashBox />
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger className="w-full">
              <Item icon={GlobeIcon} label="Publishes" />
            </PopoverTrigger>
            <PopoverContent
              className="w-96 p-0 bg-white dark:bg-black dark:text-white"
              side={isMobile ? "bottom" : "right"}
            >
              <PublishedNotes />
            </PopoverContent>
          </Popover>
        </div>
      </aside>
      <div
        ref={navbarRef}
        className={cn(
          "absolute left-60 top-0 z-[99999] w-[calc(100%-240px)]",
          isResetting && "transition-all duration-300 ease-in-out",
          isMobile && "left-0 w-full",
        )}
      >
        {!!params.documentId ? (
          <Navbar isCollapsed={isCollapsed} onResetWidth={resetWidth} />
        ) : (
          <nav className="w-full bg-transparent px-3 py-2">
            {isCollapsed && (
              <MenuIcon
                onClick={resetWidth}
                role="button"
                className="h-6 w-6 text-muted-foreground"
              />
            )}
          </nav>
        )}
      </div>
    </>
  );
};

export default Navigation;
