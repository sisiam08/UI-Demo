"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { Clock, Filter, Search } from "lucide-react";
import Link from "next/link";

import CompatibilityScoreBadge from "../shared/compatibility-score-badge";
import { EmptyState } from "../../../../../components/shared/empty-state";
import { SkeletonCards } from "../../../../../components/shared/skeletons";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SearchableSelect } from "@/components/shared/searchable-select";
import { toast } from "@/components/ui/toast";
import {
  INDUSTRY_OPTIONS,
  PROFILE_ROLE_OPTIONS,
  STARTUP_STAGE_OPTIONS,
} from "@/constants/options";
import type { IRequirementWithScore } from "@/interfaces";
import { getApiErrorMessage } from "@/lib/api-error";
import { httpGet } from "@/lib/http";

interface BrowseResult {
  data: IRequirementWithScore[];
  nextCursor: { createdAt: string; id: string } | null;
}

function buildParams(
  role: string,
  industry: string,
  stage: string,
  cursor?: { createdAt: string; id: string }
) {
  const params: Record<string, string> = {};
  if (role !== "all") params.role = role;
  if (industry !== "all") params.industry = industry;
  if (stage !== "all") params.stage = stage;
  if (cursor) params.cursor = JSON.stringify(cursor);
  return params;
}

export default function BrowseClient({
  initialRequirements,
  initialNextCursor,
  initialRole,
  initialIndustry,
  initialStage,
}: {
  initialRequirements: IRequirementWithScore[];
  initialNextCursor: BrowseResult["nextCursor"];
  initialRole: string;
  initialIndustry: string;
  initialStage: string;
}) {
  const [role, setRole] = useState(initialRole);
  const [industry, setIndustry] = useState(initialIndustry);
  const [stage, setStage] = useState(initialStage);
  const [requirements, setRequirements] =
    useState<IRequirementWithScore[]>(initialRequirements);
  const [nextCursor, setNextCursor] = useState(initialNextCursor);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const initializedRef = useRef(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const fetchRequirements = useCallback(
    async (cursor?: { createdAt: string; id: string }) => {
      const isFirst = !cursor;
      try {
        const response = await httpGet<BrowseResult>(
          "/requirements/browse",
          buildParams(role, industry, stage, cursor)
        );
        setRequirements((prev) =>
          isFirst ? response.data.data : [...prev, ...response.data.data]
        );
        setNextCursor(response.data.nextCursor);
      } catch (error) {
        toast.add({ type: "error", description: getApiErrorMessage(error) });
        if (isFirst) {
          setRequirements([]);
          setNextCursor(null);
        }
      } finally {
        if (isFirst) setLoading(false);
        else setLoadingMore(false);
      }
    },
    [role, industry, stage]
  );

  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      return;
    }

    let active = true;
    (async () => {
      if (active) await fetchRequirements();
    })();

    return () => {
      active = false;
    };
  }, [fetchRequirements]);

  const loadMore = useCallback(() => {
    if (!nextCursor) return;
    setLoadingMore(true);
    fetchRequirements(nextCursor);
  }, [nextCursor, fetchRequirements]);

  useEffect(() => {
    if (!nextCursor || loading) return;
    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !loadingMore) {
          loadMore();
        }
      },
      { rootMargin: "0px 0px 200px 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [nextCursor, loading, loadingMore, loadMore]);

  function applyFilter(setter: (v: string) => void, value: string) {
    setter(value);
    setLoading(true);
  }

  function clearFilters() {
    setRole("all");
    setIndustry("all");
    setStage("all");
    setLoading(true);
  }

  const hasFilters = role !== "all" || industry !== "all" || stage !== "all";

  return (
    <>
      <div className="space-y-3 rounded-xl border border-border bg-card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="size-4 text-muted-foreground" />
            <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Filters
            </span>
          </div>
          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={clearFilters}
            >
              Clear filters
            </Button>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-end sm:gap-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">
              Role
            </label>
            <SearchableSelect
              value={role}
              onValueChange={(v) => applyFilter(setRole, v)}
              options={[
                { value: "all", label: "All roles" },
                ...PROFILE_ROLE_OPTIONS,
              ]}
              placeholder="All roles"
              searchPlaceholder="Search roles..."
              className="w-full sm:w-36"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">
              Industry
            </label>
            <SearchableSelect
              value={industry}
              onValueChange={(v) => applyFilter(setIndustry, v)}
              options={[
                { value: "all", label: "All industries" },
                ...INDUSTRY_OPTIONS.map((i) => ({ value: i, label: i })),
              ]}
              placeholder="All industries"
              searchPlaceholder="Search industries..."
              className="w-full sm:w-36"
            />
          </div>
          <div className="col-span-2 space-y-1 sm:col-span-1">
            <label className="text-xs font-medium text-muted-foreground">
              Stage
            </label>
            <SearchableSelect
              value={stage}
              onValueChange={(v) => applyFilter(setStage, v)}
              options={[
                { value: "all", label: "All stages" },
                ...STARTUP_STAGE_OPTIONS,
              ]}
              placeholder="All stages"
              searchPlaceholder="Search stages..."
              className="w-full sm:w-36"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <SkeletonCards />
      ) : requirements.length === 0 ? (
        <EmptyState
          icon={<Search className="size-12" />}
          title="No requirements match your filters"
          description="Try adjusting or clearing your filters to see more opportunities."
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {requirements.map((item) => (
              <Link
                key={item.requirement.id}
                href={`/requirements/${item.requirement.id}`}
              >
                <Card className="h-full transition-shadow hover:shadow-md">
                  <CardContent className="space-y-3 p-5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="truncate font-semibold">
                          {item.requirement.startupIdea?.title}
                        </h3>
                        <p className="line-clamp-2 text-sm text-muted-foreground">
                          {item.requirement.startupIdea?.shortDescription}
                        </p>
                      </div>
                      <CompatibilityScoreBadge
                        score={item.compatibilityScore}
                      />
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-foreground capitalize">
                        {item.requirement.requiredRole}
                      </span>
                      {item.requirement.startupIdea?.industries
                        ?.slice(0, 2)
                        .map((ind) => (
                          <span
                            key={ind}
                            className="shrink-0 rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
                          >
                            {ind}
                          </span>
                        ))}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="size-3.5" />
                        {item.requirement.requiredWeeklyCommitment}h/wk
                      </span>
                      <span>
                        {Number(item.requirement.equityOffered)}% equity
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          {nextCursor && (
            <div ref={sentinelRef} className="flex justify-center pt-6">
              {loadingMore && (
                <div
                  className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent"
                  role="status"
                  aria-label="Loading more"
                />
              )}
            </div>
          )}
        </>
      )}
    </>
  );
}
