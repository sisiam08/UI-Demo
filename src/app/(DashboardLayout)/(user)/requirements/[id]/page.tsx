import { ArrowLeft, Clock, Percent, Tag } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import ApplyToRequirement from "../../_component/requirements/apply-to-requirement";
import CompatibilityScoreBadge from "../../_component/shared/compatibility-score-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { IRequirementWithScore } from "@/interfaces";
import { httpGet } from "@/lib/http";

export default async function RequirementDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let requirementData: IRequirementWithScore | null = null;
  try {
    const response = await httpGet<IRequirementWithScore>(
      `/requirements/${id}`
    );
    requirementData = response.data;
  } catch {
    requirementData = null;
  }

  if (!requirementData) {
    notFound();
  }

  const { requirement, compatibilityScore } = requirementData;
  const idea = requirement.startupIdea;

  return (
    <div className="max-w-3xl space-y-6">
      <Link
        href="/requirements/browse"
        className="-ml-2 inline-flex items-center gap-1 rounded-md px-2.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to browse
      </Link>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{idea?.title}</h1>
          <p className="mt-1 text-muted-foreground">{idea?.shortDescription}</p>
        </div>
        <CompatibilityScoreBadge score={compatibilityScore} size="lg" />
      </div>

      {idea && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">About this startup</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm whitespace-pre-wrap text-muted-foreground">
              {idea.fullDescription}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {idea.industries.map((ind) => (
                <span
                  key={ind}
                  className="inline-flex shrink-0 items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
                >
                  <Tag className="size-3" />
                  {ind}
                </span>
              ))}
              <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-foreground capitalize">
                {idea.startupStage} stage
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Requirement details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <span className="rounded-lg bg-muted px-3 py-1.5 text-sm font-medium text-foreground capitalize">
              {requirement.requiredRole} founder
            </span>
            <span className="flex items-center gap-1.5 rounded-lg bg-muted px-3 py-1.5 text-sm font-medium text-foreground">
              <Clock className="size-4" />
              {requirement.requiredWeeklyCommitment}h/week
            </span>
            <span className="flex items-center gap-1.5 rounded-lg bg-muted px-3 py-1.5 text-sm font-medium text-foreground">
              <Percent className="size-4" />
              {Number(requirement.equityOffered)}% equity
            </span>
          </div>
          <div>
            <h4 className="mb-2 text-sm font-semibold text-foreground">
              Required skills
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {requirement.requiredSkills.map((skill) => (
                <span
                  key={skill}
                  className="shrink-0 rounded-md border border-border px-2 py-0.5 text-xs font-medium text-foreground"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <ApplyToRequirement requirementId={id} />
    </div>
  );
}
