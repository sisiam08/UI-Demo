"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import Link from "next/link";

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
import type { IUser } from "@/interfaces";
import { getApiErrorMessage } from "@/lib/api-error";
import { getAdminUsers } from "@/services/admin.service";
import { formatDate } from "@/helpers/date-utils";
import { initials } from "@/helpers/string-utils";

export default function UsersClient({
  initialUsers,
  initialTotal,
  initialLimit,
  initialError,
}: {
  initialUsers: IUser[];
  initialTotal: number;
  initialLimit: number;
  initialError?: string;
}) {
  const [status, setStatus] = useState("all");
  const [role, setRole] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState(initialUsers);
  const [total, setTotal] = useState(initialTotal);
  const [limit, setLimit] = useState(initialLimit);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError ?? null);
  const initializedRef = useRef(false);
  const requestIdRef = useRef(0);

  const fetchUsers = useCallback(
    async (targetPage = page) => {
      const requestId = ++requestIdRef.current;
      setLoading(true);
      setError(null);
      try {
        const res = await getAdminUsers({
          status,
          role,
          search,
          page: targetPage,
        });
        if (requestId !== requestIdRef.current) return;
        setUsers(res.users);
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
    [status, role, search, page]
  );

  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      return;
    }
    void fetchUsers();
    return () => {
      requestIdRef.current += 1;
    };
  }, [fetchUsers]);

  function applyFilter(setter: (v: string) => void, value: string) {
    setter(value);
    setPage(1);
    setLoading(true);
  }

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">User Management</h1>

      <div className="flex flex-wrap items-end gap-3 rounded-xl border border-border bg-card p-4">
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">
            Status
          </label>
          <Select
            value={status}
            onValueChange={(v) => applyFilter(setStatus, v as string)}
          >
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
              <SelectItem value="banned">Banned</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">
            Role
          </label>
          <Select
            value={role}
            onValueChange={(v) => applyFilter(setRole, v as string)}
          >
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="super_admin">Super Admin</SelectItem>
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
              placeholder="Email or name..."
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
      ) : users.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-sm text-muted-foreground">
            No users match the selected filters.
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="overflow-x-auto p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.id} className="cursor-pointer">
                    <TableCell>
                      <Link
                        href={`/admin/users/${u.id}`}
                        className="flex items-center gap-2 hover:underline"
                      >
                        <div className="flex size-8 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                          {initials(u.fullName)}
                        </div>
                        <div>
                          <p className="font-medium">{u.fullName}</p>
                          <p className="text-xs text-muted-foreground">
                            {u.email}
                          </p>
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={u.systemRole} />
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={u.status} />
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(u.createdAt)}
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
