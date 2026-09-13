"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

import CompatibilityScoreBadge from "@/components/shared/compatibility-score-badge";
import { StatusBadge } from "@/components/shared/status-badge";
import { SkeletonRows } from "@/components/shared/skeletons";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/toast";
import type { IApplication } from "@/interfaces";
import { getApiErrorMessage } from "@/lib/api-error";
import { getAdminApplications } from "@/services/admin.service";
import { formatDate } from "@/helpers/date-utils";
import { initials } from "@/helpers/string-utils";

export default function ApplicationsClient({
  initialApplications,
  initialTotal,
  initialLimit,
  initialError,
}: {
  initialApplications: IApplication[];
  initialTotal: number;
  initialLimit: number;
  initialError?: string;
}) {
  const [status, setStatus] = useState("all");
  const [requirementId, setRequirementId] = useState("");
  const [candidateId, setCandidateId] = useState("");
  const [page, setPage] = useState(1);
  const [applications, setApplications] = useState(initialApplications);
  const [total, setTotal] = useState(initialTotal);
  const [limit, setLimit] = useState(initialLimit);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError ?? null);
  const initializedRef = useRef(false);
  const requestIdRef = useRef(0);

  const fetchApplications = useCallback(
    async (targetPage = page) => {
      const requestId = ++requestIdRef.current;
      setLoading(true);
      setError(null);
      try {
        const res = await getAdminApplications({
          status,
          requirementId,
          candidateId,
          page: targetPage,
        });
        if (requestId !== requestIdRef.current) return;
        setApplications(res.applications);
        setTotal(res.total);
        setLimit(res.limit);
      } catch (error) {
        if (requestId !== requestIdRef.current) return;
        const message = getApiErrorMessage(error);
        setError(message);
        toast.add({ type: "error", description: message });
      } finally {
        if (requestId === requestIdRef.current) setLoading(false);
      }
    },
    [status, requirementId, candidateId, page]
  );

  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      return;
    }
    void fetchApplications();
    return () => {
      requestIdRef.current += 1;
    };
  }, [fetchApplications]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Applications Oversight</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Cross-user application visibility for dispute investigation
          (read-only)
        </p>
      </div>

      <div className="flex flex-wrap items-end gap-3 rounded-xl border border-border bg-card p-4">
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">
            Status
          </label>
          <Select
            value={status}
            onValueChange={(v) => {
              setStatus(v as string);
              setPage(1);
              setLoading(true);
            }}
          >
            <SelectTrigger className="w-full sm:w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="withdrawn">Withdrawn</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">
            Requirement ID
          </label>
          <Input
            value={requirementId}
            onChange={(e) => {
              setRequirementId(e.target.value);
              setPage(1);
              setLoading(true);
            }}
            placeholder="UUID..."
            className="w-full sm:w-64"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">
            Candidate ID
          </label>
          <Input
            value={candidateId}
            onChange={(e) => {
              setCandidateId(e.target.value);
              setPage(1);
              setLoading(true);
            }}
            placeholder="UUID..."
            className="w-full sm:w-64"
          />
        </div>
      </div>

      {loading ? (
        <SkeletonRows />
      ) : error ? (
        <Card>
          <CardContent className="p-6 text-sm text-destructive">
            {error}
          </CardContent>
        </Card>
      ) : applications.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-sm text-muted-foreground">
            No applications match the selected filters.
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="overflow-x-auto p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidate</TableHead>
                  <TableHead>Startup</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Applied</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell>
                      {app.candidate && (
                        <Link
                          href={`/admin/users/${app.candidate.id}`}
                          className="flex items-center gap-2 hover:underline"
                        >
                          <div className="flex size-6 items-center justify-center rounded-full bg-muted text-xs">
                            {initials(app.candidate.fullName)}
                          </div>
                          {app.candidate.fullName}
                        </Link>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      {app.requirement?.startupIdea?.title ?? "—"}
                    </TableCell>
                    <TableCell>
                      <CompatibilityScoreBadge score={app.compatibilityScore} />
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={app.status} />
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(app.createdAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            disabled={page <= 1}
            onClick={() => {
              setPage(page - 1);
              setLoading(true);
            }}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            disabled={page >= totalPages}
            onClick={() => {
              setPage(page + 1);
              setLoading(true);
            }}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
