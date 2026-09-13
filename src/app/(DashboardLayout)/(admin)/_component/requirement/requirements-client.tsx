"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { Archive, ChevronLeft, ChevronRight } from "lucide-react";

import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { StatusBadge } from "@/components/shared/status-badge";
import { SkeletonRows } from "@/components/shared/skeletons";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import type { ICofounderRequirement } from "@/interfaces";
import { getApiErrorMessage } from "@/lib/api-error";
import {
  closeRequirement,
  getAdminRequirements,
} from "@/services/admin.service";
import { formatDate } from "@/helpers/date-utils";

export default function RequirementsClient({
  initialRequirements,
  initialTotal,
  initialLimit,
  initialError,
}: {
  initialRequirements: ICofounderRequirement[];
  initialTotal: number;
  initialLimit: number;
  initialError?: string;
}) {
  const [status, setStatus] = useState("all");
  const [role, setRole] = useState("all");
  const [page, setPage] = useState(1);
  const [requirements, setRequirements] = useState(initialRequirements);
  const [total, setTotal] = useState(initialTotal);
  const [limit, setLimit] = useState(initialLimit);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError ?? null);
  const [closeId, setCloseId] = useState<string | null>(null);
  const initializedRef = useRef(false);
  const requestIdRef = useRef(0);

  const fetchRequirements = useCallback(
    async (targetPage = page) => {
      const requestId = ++requestIdRef.current;
      setLoading(true);
      setError(null);
      try {
        const res = await getAdminRequirements({
          status,
          role,
          page: targetPage,
        });
        if (requestId !== requestIdRef.current) return;
        setRequirements(res.requirements);
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
    [status, role, page]
  );

  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      return;
    }
    void fetchRequirements();
    return () => {
      requestIdRef.current += 1;
    };
  }, [fetchRequirements]);

  async function handleClose(id: string) {
    try {
      await closeRequirement(id);
      toast.add({ type: "success", description: "Requirement closed" });
      await fetchRequirements();
    } catch (error) {
      toast.add({ type: "error", description: getApiErrorMessage(error) });
    }
  }

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Content Moderation — Requirements</h1>

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
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">
            Role
          </label>
          <Select
            value={role}
            onValueChange={(v) => {
              setRole(v as string);
              setPage(1);
              setLoading(true);
            }}
          >
            <SelectTrigger className="w-full sm:w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="technical">Technical</SelectItem>
              <SelectItem value="design">Design</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="business">Business</SelectItem>
            </SelectContent>
          </Select>
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
      ) : requirements.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-sm text-muted-foreground">
            No requirements match the selected filters.
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="overflow-x-auto p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Startup</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Commitment</TableHead>
                  <TableHead>Equity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requirements.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell className="font-medium">
                      {req.startupIdea?.title ?? "—"}
                    </TableCell>
                    <TableCell className="capitalize">
                      {req.requiredRole}
                    </TableCell>
                    <TableCell>{req.requiredWeeklyCommitment}h/wk</TableCell>
                    <TableCell>{Number(req.equityOffered)}%</TableCell>
                    <TableCell>
                      <StatusBadge status={req.status} />
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(req.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      {req.status === "open" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setCloseId(req.id)}
                        >
                          <Archive className="size-4" />
                          Close
                        </Button>
                      )}
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

      <ConfirmDialog
        open={!!closeId}
        onOpenChange={(open) => !open && setCloseId(null)}
        title="Force-close this requirement?"
        confirmLabel="Close"
        onConfirm={() => closeId && void handleClose(closeId)}
      />
    </div>
  );
}
