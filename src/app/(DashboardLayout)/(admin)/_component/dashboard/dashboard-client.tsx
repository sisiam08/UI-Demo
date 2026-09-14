"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Area,
  AreaChart,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
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
} from "@/services/admin.service";
import {
  AdminApplicationStats,
  AdminOverview,
  AdminRequirementStats,
  AdminSignupRow,
} from "@/interfaces";

function ChartMessage({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-62.5 items-center justify-center rounded-lg border border-dashed border-border/70 bg-muted/20 px-6 text-center text-sm text-muted-foreground">
      {children}
    </div>
  );
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name?: string; value?: number | string }>;
  label?: string | number;
}) {
  if (!active || !payload?.length) return null;

  const item = payload[0];

  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 text-xs shadow-xl">
      <p className="font-medium text-foreground">{label ?? item.name}</p>
      <p className="mt-1 text-muted-foreground">
        Value:{" "}
        <span className="font-semibold text-foreground">
          {item.value ?? "—"}
        </span>
      </p>
    </div>
  );
}

function formatSignupDate(value: string) {
  const date = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? new Date(`${value}T00:00:00`)
    : new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

function KpiRing({
  label,
  value,
  percent,
  color,
}: {
  label: string;
  value: number | string;
  percent: number;
  color: string;
}) {
  const data = [
    { name: label, value: Math.max(0, Math.min(percent, 100)), fill: color },
  ];

  return (
    <Card className="overflow-hidden border-border/70 bg-card/80">
      <CardContent className="flex items-center gap-4 p-4">
        <div className="relative size-19 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="72%"
              outerRadius="100%"
              barSize={8}
              data={data}
              startAngle={90}
              endAngle={-270}
            >
              <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
              <RadialBar
                background={{ fill: "var(--chart-grid)" }}
                dataKey="value"
                cornerRadius={8}
              />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold">
            {value}
          </div>
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">
            {label}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {label === "Open startups"
              ? `${percent}% available`
              : `${percent}% of tracked total`}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardClient() {
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [appStats, setAppStats] = useState<AdminApplicationStats | undefined>();
  const [reqStats, setReqStats] = useState<AdminRequirementStats | undefined>();
  const [signups, setSignups] = useState<AdminSignupRow[] | undefined>();
  const [overviewLoading, setOverviewLoading] = useState(true);
  const [overviewError, setOverviewError] = useState<string | null>(null);
  const [appStatsLoading, setAppStatsLoading] = useState(true);
  const [appStatsError, setAppStatsError] = useState<string | null>(null);
  const [reqStatsLoading, setReqStatsLoading] = useState(true);
  const [reqStatsError, setReqStatsError] = useState<string | null>(null);
  const [signupsLoading, setSignupsLoading] = useState(true);
  const [signupsError, setSignupsError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void getAdminOverview()
      .then((data) => {
        if (active) setOverview(data);
      })
      .catch((error) => {
        if (!active) return;
        const message = getApiErrorMessage(error);
        setOverviewError(message);
        toast.add({ type: "error", description: message });
      })
      .finally(() => {
        if (active) setOverviewLoading(false);
      });

    void getAdminApplicationStats()
      .then((data) => {
        if (active) setAppStats(data);
      })
      .catch((error) => {
        if (!active) return;
        const message = getApiErrorMessage(error);
        setAppStatsError(message);
        toast.add({ type: "error", description: message });
      })
      .finally(() => {
        if (active) setAppStatsLoading(false);
      });

    void getAdminRequirementStats()
      .then((data) => {
        if (active) setReqStats(data);
      })
      .catch((error) => {
        if (!active) return;
        const message = getApiErrorMessage(error);
        setReqStatsError(message);
        toast.add({ type: "error", description: message });
      })
      .finally(() => {
        if (active) setReqStatsLoading(false);
      });

    void getAdminUserSignups()
      .then((data) => {
        if (active) setSignups(data);
      })
      .catch((error) => {
        if (!active) return;
        const message = getApiErrorMessage(error);
        setSignupsError(message);
        toast.add({ type: "error", description: message });
      })
      .finally(() => {
        if (active) setSignupsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  if (overviewLoading && !overview) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <SkeletonStatGrid />
      </div>
    );
  }

  const appChartData = Object.entries(appStats?.byStatus ?? {}).map(
    ([status, count]) => ({ name: status, count })
  );
  const reqChartData = [
    { name: "Open", count: reqStats?.open ?? 0 },
    { name: "Closed", count: reqStats?.closed ?? 0 },
  ];
  const signupChartData = (signups ?? []).map((row) => ({
    date: formatSignupDate(row.date),
    signups: parseInt(row.count, 10),
  }));
  const totalApplications = Object.values(overview?.applications ?? {}).reduce(
    (sum, count) => sum + count,
    0
  );
  const totalRequirements = (reqStats?.open ?? 0) + (reqStats?.closed ?? 0);
  const percentOf = (value: number, total: number) =>
    total > 0 ? Math.round((value / total) * 100) : 0;
  const kpiRings = [
    {
      label: "Active sessions",
      value: overview?.activeSessions ?? "—",
      percent: percentOf(overview?.activeSessions ?? 0, overview?.users ?? 0),
      color: "var(--chart-cyan)",
    },
    {
      label: "Open requirements",
      value: overview?.requirements.open ?? "—",
      percent: percentOf(reqStats?.open ?? 0, totalRequirements),
      color: "var(--chart-violet)",
    },
    {
      label: "Pending applications",
      value: overview?.applications.pending ?? "—",
      percent: percentOf(
        overview?.applications.pending ?? 0,
        totalApplications
      ),
      color: "var(--chart-pink)",
    },
    {
      label: "Open startups",
      value: overview?.startupsByStatus?.open ?? "—",
      percent: percentOf(
        overview?.startupsByStatus?.open ?? 0,
        overview?.startups ?? 0
      ),
      color: "var(--chart-amber)",
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {overviewError && (
        <Card>
          <CardContent className="p-6 text-sm text-destructive">
            {overviewError}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {kpiRings.map((metric) => (
          <KpiRing key={metric.label} {...metric} />
        ))}
      </div>

      <Card className="border-border/70 bg-card/60">
        <CardHeader>
          <CardTitle className="text-base">Platform health</CardTitle>
          <p className="mt-1 text-xs text-muted-foreground">
            A quick view of account activity, startup availability, and
            application outcomes
          </p>
        </CardHeader>
        <CardContent className="grid gap-5 md:grid-cols-3">
          {[
            {
              label: "User activity",
              value: overview?.usersByStatus?.active ?? 0,
              total: overview?.users ?? 0,
              detail: `${overview?.usersByStatus?.suspended ?? 0} suspended - ${overview?.usersByStatus?.banned ?? 0} banned`,
              color: "var(--chart-cyan)",
            },
            {
              label: "Startup availability",
              value: overview?.startupsByStatus?.open ?? 0,
              total: overview?.startups ?? 0,
              detail: `${overview?.startupsByStatus?.closed ?? 0} closed`,
              color: "var(--chart-violet)",
            },
            {
              label: "Application success",
              value: overview?.applicationSummary?.accepted ?? 0,
              total: overview?.applicationSummary?.total ?? totalApplications,
              detail: `${overview?.applicationSummary?.acceptanceRate ?? 0}% accepted`,
              color: "var(--chart-amber)",
            },
          ].map((metric) => {
            const percentage = percentOf(metric.value, metric.total);
            return (
              <div key={metric.label} className="space-y-2">
                <div className="flex items-end justify-between gap-3">
                  <p className="text-sm font-medium">{metric.label}</p>
                  <p className="text-lg font-semibold">{percentage}%</p>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: metric.color,
                    }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {metric.value} of {metric.total} · {metric.detail}
                </p>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between gap-4">
              <div>
                <CardTitle className="text-base">User signups</CardTitle>
                <p className="mt-1 text-xs text-muted-foreground">
                  New accounts created over time
                </p>
              </div>
              <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-1 text-xs font-medium text-cyan-300">
                Live trend
              </span>
            </div>
          </CardHeader>
          <CardContent>
            {signupsLoading ? (
              <ChartMessage>Loading signup trend...</ChartMessage>
            ) : signupsError ? (
              <ChartMessage>{signupsError}</ChartMessage>
            ) : signupChartData.length === 0 ? (
              <ChartMessage>No signup data yet</ChartMessage>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart
                  data={signupChartData}
                  margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="signupFill" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor="var(--chart-cyan)"
                        stopOpacity={0.32}
                      />
                      <stop
                        offset="100%"
                        stopColor="var(--chart-cyan)"
                        stopOpacity={0.02}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    vertical={false}
                    stroke="var(--chart-grid)"
                    strokeOpacity={0.5}
                  />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    fontSize={11}
                    stroke="var(--chart-muted)"
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    fontSize={11}
                    allowDecimals={false}
                    stroke="var(--chart-muted)"
                  />
                  <Tooltip cursor={false} content={<ChartTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="signups"
                    stroke="var(--chart-cyan)"
                    strokeWidth={2.5}
                    fill="url(#signupFill)"
                    activeDot={{ r: 5 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Application funnel</CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">
              Current application status mix
            </p>
          </CardHeader>
          <CardContent>
            {appStatsLoading ? (
              <ChartMessage>Loading application mix...</ChartMessage>
            ) : appStatsError ? (
              <ChartMessage>{appStatsError}</ChartMessage>
            ) : appChartData.length === 0 ? (
              <ChartMessage>No application data yet</ChartMessage>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart
                  data={appChartData}
                  margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    vertical={false}
                    stroke="var(--chart-grid)"
                    strokeOpacity={0.5}
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    fontSize={11}
                    stroke="var(--chart-muted)"
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    fontSize={11}
                    allowDecimals={false}
                    stroke="var(--chart-muted)"
                  />
                  <Tooltip cursor={false} content={<ChartTooltip />} />
                  <Bar dataKey="count" radius={[5, 5, 0, 0]}>
                    {appChartData.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={
                          [
                            "var(--chart-violet)",
                            "var(--chart-cyan)",
                            "var(--chart-amber)",
                            "var(--chart-pink)",
                          ][index % 4]
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Requirements: open vs closed
            </CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">
              Moderation workload at a glance
            </p>
          </CardHeader>
          <CardContent>
            {reqStatsLoading ? (
              <ChartMessage>Loading requirement mix...</ChartMessage>
            ) : reqStatsError ? (
              <ChartMessage>{reqStatsError}</ChartMessage>
            ) : totalRequirements === 0 ? (
              <ChartMessage>No requirement data yet</ChartMessage>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart
                  data={reqChartData}
                  margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    vertical={false}
                    stroke="var(--chart-grid)"
                    strokeOpacity={0.5}
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    fontSize={11}
                    stroke="var(--chart-muted)"
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    fontSize={11}
                    allowDecimals={false}
                    stroke="var(--chart-muted)"
                  />
                  <Tooltip cursor={false} content={<ChartTooltip />} />
                  <Bar dataKey="count" radius={[5, 5, 0, 0]}>
                    <Cell fill="var(--chart-cyan)" />
                    <Cell fill="var(--chart-amber)" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Requirements by Role</CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">
              Demand across the talent categories
            </p>
          </CardHeader>
          <CardContent>
            {reqStatsLoading ? (
              <ChartMessage>Loading role breakdown...</ChartMessage>
            ) : reqStatsError ? (
              <ChartMessage>{reqStatsError}</ChartMessage>
            ) : Object.keys(reqStats?.byRole ?? {}).length === 0 ? (
              <ChartMessage>No role data yet</ChartMessage>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart
                  data={Object.entries(reqStats?.byRole ?? {}).map(
                    ([role, count]) => ({ name: role, count })
                  )}
                  layout="vertical"
                  margin={{ top: 8, right: 8, left: 8, bottom: 0 }}
                >
                  <CartesianGrid
                    horizontal={false}
                    stroke="var(--chart-grid)"
                    strokeOpacity={0.5}
                  />
                  <XAxis
                    type="number"
                    axisLine={false}
                    tickLine={false}
                    fontSize={11}
                    allowDecimals={false}
                    stroke="var(--chart-muted)"
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    fontSize={11}
                    stroke="var(--chart-muted)"
                    width={72}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar
                    dataKey="count"
                    fill="var(--chart-amber)"
                    radius={[0, 5, 5, 0]}
                    barSize={18}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
