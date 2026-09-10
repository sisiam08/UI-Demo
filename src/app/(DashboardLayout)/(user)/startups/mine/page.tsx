import { ArrowRight, Plus, Rocket } from "lucide-react";
import Link from "next/link";

import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import type { IStartupIdea } from "@/interfaces";
import { getMyStartups } from "@/service/startup.services";

export const dynamic = "force-dynamic";

export default async function MyStartupsPage() {
  let startups: IStartupIdea[] = [];
  try {
    startups = await getMyStartups();
  } catch {
    startups = [];
  }

  return (
    <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">My Startup Ideas</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your startup ideas and their co-founder requirements
          </p>
        </div>

      {startups.length === 0 ? (
        <EmptyState
          icon={<Rocket className="size-12" />}
          title="No startup ideas yet"
          description="Create your first startup idea to start finding co-founders."
          actionLabel="Create startup idea"
          actionHref="/startups/new"
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {startups.map((startup) => (
            <Link key={startup.id} href={`/startups/${startup.id}`}>
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardContent className="space-y-3 p-5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="truncate font-semibold">{startup.title}</h3>
                    <StatusBadge status={startup.status} />
                  </div>
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {startup.shortDescription}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {startup.industries.slice(0, 3).map((ind) => (
                      <span
                        key={ind}
                        className="shrink-0 rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
                      >
                        {ind}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between border-t border-border pt-2">
                    <span className="text-xs text-muted-foreground">
                      {startup.requirements?.length ?? 0} requirements
                    </span>
                    <ArrowRight className="size-4 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
