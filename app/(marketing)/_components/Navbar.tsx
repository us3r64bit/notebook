"use client";

import { useScrollTop } from "@/hooks/useScrollTop";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { ModeToggle } from "@/components/ModalToggle";
import { useConvexAuth } from "convex/react";
import { SignInButton, UserButton } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/Spinner";
import Link from "next/link";

const Navbar = () => {
  const{isAuthenticated, isLoading} = useConvexAuth();
  const scrolled = useScrollTop();
  return(
    <div className={cn(
        "fixed top-0 z-50 flex w-full items-center bg-white p-6 dark:bg-[#1f1f1f]",
        scrolled && "border-b shadow-sm",
      )}>
        <Logo/>
        <div className="flex w-full items-center justify-between gap-x-2 md:ml-auto md:justify-end">
            {
              isLoading && <Spinner/>
            }
            {
              !isAuthenticated && !isLoading && (
                <>
                  <SignInButton>
                    <Button variant={"ghost"}>
                      Log in
                    </Button>
                  </SignInButton>
                  <SignInButton>
                    <Button>
                      Get Notebook free
                    </Button>
                  </SignInButton>
                </>
              )
            }
            {
              isAuthenticated && !isLoading &&
              <>
                <Button variant={"ghost"} size={"sm"}>
                  <Link href={"/documents"}>
                    Enter NoteBook
                  </Link>
                </Button>
                <UserButton />
              </>
            }
            <ModeToggle/>
        </div>
    </div>
  )
};

export default Navbar;