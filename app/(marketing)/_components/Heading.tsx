"use client";

import { Spinner } from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { SignInButton } from "@clerk/clerk-react";
import { useConvexAuth } from "convex/react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export const Heading = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  return (
    <div className="max-w-3xl space-y-2 border">
      <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold">
        Connect, Create, and Conquer Your Tasks.
      </h1>
      <h3 className="text-base sm:text-xl md:text-2xl font-medium">
        Notebook is the connected workspace where <br />
        better, faster work happens.
      </h3>
      {!isAuthenticated && !isLoading && (
        <SignInButton>
          <Button>Get Notebook free</Button>
        </SignInButton>
      )}
      {isLoading && (
        <>
          <div className="w-full flex items-center justify-center">
            <Spinner size={"lg"}/>
          </div>
        </>
      )}
      {isAuthenticated && !isLoading && (
        <Button asChild>
          <Link href={"/documents"}>
            Enter Notebook
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      )}
    </div>
  );
};
