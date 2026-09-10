import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";

export default async function NotFound() {
  return (
    <div className="flex min-h-[75vh] w-full flex-col items-center justify-center overflow-hidden px-4 py-12 text-center">
      <div className="flex max-w-md flex-col items-center">
        <div className="mb-6 rounded-2xl bg-muted/50 p-3 ring-1 ring-border/50 backdrop-blur-sm">
          <Logo showText={false} iconSize={40} />
        </div>

        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          Error 404
        </span>

        <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
          Page not found
        </h1>

        <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
          Sorry, we couldn’t find the page you’re looking for. It might have
          been removed, renamed, or doesn’t exist.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button
            nativeButton={false}
            render={<Link href="/" />}
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
