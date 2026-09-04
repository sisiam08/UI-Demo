import { Skeleton } from "@/components/ui/skeleton";

export default function RequirementLoading() {
  return (
    <div className="max-w-3xl space-y-6">
      <Skeleton className="h-8 w-24" />
      <Skeleton className="h-12 w-3/4" />
      <Skeleton className="h-40 w-full" />
    </div>
  );
}
