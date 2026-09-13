"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  Archive,
  ChevronLeft,
  ChevronRight,
  Search,
  Trash2,
} from "lucide-react";
import Link from "next/link";

import { ConfirmDialog } from "@/components/shared/confirm-dialog";
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
import type { IStartupIdea } from "@/interfaces";
import { getApiErrorMessage } from "@/lib/api-error";
import { getAdminStartups } from "@/services/admin.service";
import { closeStartup, deleteStartup } from "@/services/startup.service";
import { formatDate } from "@/helpers/date-utils";
import { initials } from "@/helpers/string-utils";

export default function StartupsClient({
  initialStartups,
  initialTotal,
  initialLimit,
  initialError,
}: {
  initialStartups: IStartupIdea[];
  initialTotal: number;
  initialLimit: number;
  initialError?: string;
}) {
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [startups, setStartups] = useState(initialStartups);
  const [total, setTotal] = useState(initialTotal);
  const [limit, setLimit] = useState(initialLimit);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError ?? null);
  const [closeId, setCloseId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const initializedRef = useRef(false);
  const requestIdRef = useRef(0);

  const fetchStartups = useCallback(
    async (targetPage = page) => {
      const requestId = ++requestIdRef.current;
      setLoading(true);
      setError(null);
      try {
        const res = await getAdminStartups({
          status,
          search,
          page: targetPage,
        });
        if (requestId !== requestIdRef.current) return;
        setStartups(res.startups);
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
    [status, search, page]
  );

  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      return;
    }
    void fetchStartups();
    return () => {
      requestIdRef.current += 1;
    };
  }, [fetchStartups]);

  async function handleClose(id: string) {
    try {
      await closeStartup(id);
      toast.add({ type: "success", description: "Startup closed" });
      await fetchStartups();
    } catch (error) {
      toast.add({ type: "error", description: getApiErrorMessage(error) });
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteStartup(id);
      toast.add({ type: "success", description: "Startup removed" });
      await fetchStartups();
    } catch (error) {
      toast.add({ type: "error", description: getApiErrorMessage(error) });
    }
  }

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Content Moderation — Startups</h1>

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
        <div className="flex-1 space-y-1">
          <label className="text-xs font-medium text-muted-foreground">
            Search
          </label>
          <div className="relative">
            <Search className="absolute top-3 left-3 size-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
                setLoading(true);
              }}
              placeholder="Title or description..."
              className="pl-9"
            />
          </div>
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
      ) : startups.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-sm text-muted-foreground">
            No startups match the selected filters.
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="overflow-x-auto p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {startups.map((startup) => (
                  <TableRow key={startup.id}>
                    <TableCell className="font-medium">
                      {startup.title}
                    </TableCell>
                    <TableCell>
                      {startup.owner && (
                        <Link
                          href={`/admin/users/${startup.owner.id}`}
                          className="flex items-center gap-2 hover:underline"
                        >
                          <div className="flex size-6 items-center justify-center rounded-full bg-muted text-xs">
                            {initials(startup.owner.fullName)}
                          </div>
                          {startup.owner.fullName}
                        </Link>
                      )}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={startup.status} />
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(startup.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {startup.status === "open" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setCloseId(startup.id)}
                          >
                            <Archive className="size-4" />
                            Close
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive"
                          onClick={() => setDeleteId(startup.id)}
                        >
                          <Trash2 className="size-4" />
                          Remove
                        </Button>
                      </div>
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
        title="Force-close this startup?"
        confirmLabel="Close"
        onConfirm={() => closeId && void handleClose(closeId)}
      />
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Remove this startup permanently?"
        description="This cascades to all its requirements and applications."
        confirmLabel="Remove permanently"
        variant="destructive"
        onConfirm={() => deleteId && void handleDelete(deleteId)}
      />
    </div>
  );
}
