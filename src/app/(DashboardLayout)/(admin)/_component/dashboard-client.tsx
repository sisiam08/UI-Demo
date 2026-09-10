"use client";

import { useEffect, useState } from "react";

import {
  FileText,
  ListChecks,
  Mail,
  MonitorSmartphone,
  Rocket,
  Users,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { SkeletonStatGrid } from "@/components/shared/skeletons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/toast";
import { getApiErrorMessage } from "@/lib/api-error";
import {
  getAdminApplicationStats,
  getAdminOverview,
  getAdminRequirementStats,
  getAdminUserSignups,
  type AdminApplicationStats,
  type AdminOverview,
  type AdminRequirementStats,
  type AdminSignupRow,
} from "@/service/admin.services";

function DashboardClient() {
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [appStats, setAppStats] = useState<AdminApplicationStats | undefined>();
  const [reqStats, setReqStats] = useState<AdminRequirementStats | undefined>();
  const [signups, setSignups] = useState<AdminSignupRow[] | undefined>();
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [overviewRes, appRes, reqRes, signupRes] = await Promise.all([
          getAdminOverview(),
          getAdminApplicationStats(),
          getAdminRequirementStats(),
          getAdminUserSignups(),
        ]);
        if (active) {
          setOverview(overviewRes);
          setAppStats(appRes);
          setReqStats(reqRes);
          setSignups(signupRes);
        }
      } catch (error) {
        if (active) {
          const message = getApiErrorMessage(error);
          setLoadError(message);
          toast.add({ type: "error", description: message });
        }
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <SkeletonStatGrid />
      </div>
    );
  }

  if (loadError || !overview) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Card>
          <CardContent className="p-6 text-sm text-muted-foreground">
            {loadError ?? "Dashboard data is unavailable."}
          </CardContent>
        </Card>
      </div>
    );
  }

  const stats = [
    { label: "Total Users", value: overview.users, icon: Users },
    { label: "Total Startups", value: overview.startups, icon: Rocket },
    {
      label: "Open Requirements",
      value: overview.requirements.open,
      icon: ListChecks,
    },
    {
      label: "Pending Applications",
      value: overview.applications.pending ?? 0,
      icon: FileText,
    },
    { label: "Messages Sent", value: overview.messages, icon: Mail },
    {
      label: "Active Sessions",
      value: overview.activeSessions,
      icon: MonitorSmartphone,
    },
  ];

  const appChartData = Object.entries(appStats?.byStatus ?? {}).map(
    ([status, count]) => ({ name: status, count })
  );
  const reqChartData = [
    { name: "Open", count: reqStats?.open ?? 0 },
    { name: "Closed", count: reqStats?.closed ?? 0 },
  ];
  const signupChartData = (signups ?? []).map((row) => ({
    date: row.date,
    signups: parseInt(row.count, 10),
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">
                  {s.label}
                </p>
                <s.icon className="size-4 text-muted-foreground" />
              </div>
              <p className="mt-2 text-2xl font-bold">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">User Signups Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            {signupChartData.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No data yet
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={signupChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" fontSize={12} />
                  <YAxis fontSize={12} allowDecimals={false} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="signups"
                    stroke="#2563eb"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Application Funnel</CardTitle>
          </CardHeader>
          <CardContent>
            {appChartData.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No data yet
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={appChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis fontSize={12} allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Requirements: Open vs Closed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={reqChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Requirements by Role</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={Object.entries(reqStats?.byRole ?? {}).map(
                  ([role, count]) => ({ name: role, count })
                )}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export { DashboardClient };
