"use client";

import { cn } from "@/lib/utils";

export default function Loader({
  fullScreen = false,
}: {
  fullScreen?: boolean;
}) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        "size-4 animate-spin rounded-full border-2 border-primary border-t-transparent",
        fullScreen && "fixed inset-0 m-auto"
      )}
    />
  );
}
