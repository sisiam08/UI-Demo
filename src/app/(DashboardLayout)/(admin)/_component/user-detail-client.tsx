"use client";

import { useState } from "react";

import { ArrowLeft, Ban, Shield, Trash2, Unlock } from "lucide-react";
import Link from "next/link";

import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/toast";
import type { SystemRole } from "@/constants/user-role";
import type { AdminUserDetail, IUserSession, UserStatus } from "@/interfaces";
import { getApiErrorMessage } from "@/lib/api-error";
import {
  revokeAdminSession,
  revokeAllUserSessions,
  updateUserRole,
  updateUserStatus,
} from "@/services/admin.service";
import { formatDateTime } from "@/helpers/date-utils";

import { ReasonDialog } from "./reason-dialog";

function UserDetailClient({
  user,
  sessions,
  isSuperAdmin,
}: {
  user: AdminUserDetail;
  sessions: IUserSession[];
  isSuperAdmin: boolean;
}) {
  const [suspendDialog, setSuspendDialog] = useState(false);
  const [banConfirm, setBanConfirm] = useState(false);
  const [revokeSessionId, setRevokeSessionId] = useState<string | null>(null);
  const [revokeAll, setRevokeAll] = useState(false);
  const [newRole, setNewRole] = useState<SystemRole | null>(null);

  async function handleStatus(status: UserStatus, reason?: string) {
    try {
      await updateUserStatus(user.id, { status, reason });
      toast.add({ type: "success", description: "User status updated" });
      window.location.reload();
    } catch (error) {
      toast.add({ type: "error", description: getApiErrorMessage(error) });
    }
  }

  async function handleRole(role: SystemRole) {
    try {
      await updateUserRole(user.id, role);
      toast.add({ type: "success", description: "Role updated" });
      window.location.reload();
    } catch (error) {
      toast.add({ type: "error", description: getApiErrorMessage(error) });
    }
  }

  async function handleRevokeSession(sessionId: string) {
    try {
      await revokeAdminSession(sessionId);
      toast.add({ type: "success", description: "Session revoked" });
      window.location.reload();
    } catch (error) {
      toast.add({ type: "error", description: getApiErrorMessage(error) });
    }
  }

  async function handleRevokeAll() {
    try {
      await revokeAllUserSessions(user.id);
      toast.add({ type: "success", description: "All sessions revoked" });
      window.location.reload();
    } catch (error) {
      toast.add({ type: "error", description: getApiErrorMessage(error) });
    }
  }

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        size="sm"
        nativeButton={false}
        render={<Link href="/admin/users" />}
        className="-ml-2"
      >
        <ArrowLeft className="size-4" />
        Back to Users
      </Button>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{user.fullName}</h1>
          <p className="text-muted-foreground">{user.email}</p>
          <div className="mt-2 flex gap-2">
            <StatusBadge status={user.status} />
            <StatusBadge status={user.systemRole} />
          </div>
          {user.suspendedReason && (
            <p className="mt-2 text-sm text-warning">
              Suspension reason: {user.suspendedReason}
            </p>
          )}
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sessions">
            Sessions ({sessions.length})
          </TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">User ID</span>
                <span className="font-mono text-xs">{user.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Joined</span>
                <span>{formatDateTime(user.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Active sessions</span>
                <span>{user.activeSessionsCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Startup ideas</span>
                <span>{user.startupIdeas?.length ?? 0}</span>
              </div>
            </CardContent>
          </Card>

          {user.startupIdeas && user.startupIdeas.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Startup Ideas</CardTitle>
              </CardHeader>
              <CardContent className="overflow-x-auto p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {user.startupIdeas.map((startup) => (
                      <TableRow key={startup.id}>
                        <TableCell className="font-medium">
                          {startup.title}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={startup.status} />
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDateTime(startup.createdAt)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4">
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              className="w-full sm:w-auto"
              onClick={() => setRevokeAll(true)}
              disabled={sessions.length === 0}
            >
              <Trash2 className="size-4" />
              Revoke All
            </Button>
          </div>
          <Card>
            <CardContent className="overflow-x-auto p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Device</TableHead>
                    <TableHead>IP</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sessions.map((session) => (
                    <TableRow key={session.id}>
                      <TableCell className="text-sm">
                        {session.userAgent?.slice(0, 50) || "—"}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {session.ipAddress || "—"}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDateTime(session.lastActiveAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive"
                          onClick={() => setRevokeSessionId(session.id)}
                        >
                          Revoke
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="actions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Account Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {user.status === "active" && (
                <>
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto"
                    onClick={() => setSuspendDialog(true)}
                  >
                    <Ban className="size-4" />
                    Suspend User
                  </Button>
                  <Button
                    variant="destructive"
                    className="w-full sm:w-auto"
                    onClick={() => setBanConfirm(true)}
                  >
                    <Ban className="size-4" />
                    Ban User (Permanent)
                  </Button>
                </>
              )}
              {user.status === "suspended" && (
                <Button
                  variant="success"
                  className="w-full sm:w-auto"
                  onClick={() => void handleStatus("active")}
                >
                  <Unlock className="size-4" />
                  Unsuspend
                </Button>
              )}
              {user.status === "banned" && (
                <p className="text-sm text-muted-foreground">
                  This account is permanently banned. Banning is modeled as
                  irreversible.
                </p>
              )}
            </CardContent>
          </Card>

          {isSuperAdmin && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Role Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Current role: <StatusBadge status={user.systemRole} />
                </p>
                <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
                  <Select onValueChange={(v) => setNewRole(v as SystemRole)}>
                    <SelectTrigger className="w-full sm:w-40">
                      <SelectValue placeholder="Select role..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="super_admin">Super Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={() => newRole && void handleRole(newRole)}
                    disabled={!newRole || newRole === user.systemRole}
                    className="w-full sm:w-auto"
                  >
                    <Shield className="size-4" />
                    Change Role
                  </Button>
                </div>
                <p className="text-xs text-warning">
                  Role changes are the most sensitive action in the system.
                  Proceed with caution.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <ReasonDialog
        open={suspendDialog}
        onOpenChange={setSuspendDialog}
        title="Suspend this user?"
        description="The user will be logged out immediately and won't be able to access the app."
        confirmLabel="Suspend"
        onConfirm={(reason) => void handleStatus("suspended", reason)}
      />

      <ConfirmDialog
        open={banConfirm}
        onOpenChange={setBanConfirm}
        title="Ban this user permanently?"
        description="This action is irreversible. The user will be logged out and can never access the app again."
        confirmLabel="Ban permanently"
        onConfirm={() => void handleStatus("banned")}
      />

      <ConfirmDialog
        open={!!revokeSessionId}
        onOpenChange={(open) => !open && setRevokeSessionId(null)}
        title="Revoke this session?"
        confirmLabel="Revoke"
        onConfirm={() =>
          revokeSessionId && void handleRevokeSession(revokeSessionId)
        }
      />

      <ConfirmDialog
        open={revokeAll}
        onOpenChange={setRevokeAll}
        title="Revoke all sessions?"
        description="The user will be logged out from all devices immediately."
        confirmLabel="Revoke All"
        onConfirm={() => void handleRevokeAll()}
      />
    </div>
  );
}

export { UserDetailClient };
