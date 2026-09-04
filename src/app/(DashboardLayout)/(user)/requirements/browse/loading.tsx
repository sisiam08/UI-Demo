import { SkeletonCards } from "@/components/shared/skeletons";

export default function BrowseLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="h-6 w-52 rounded-md bg-muted" />
        <div className="h-4 w-72 rounded-md bg-muted" />
      </div>
      <SkeletonCards />
    </div>
  );
}
