import { AlertTriangle } from "lucide-react";
import Link from "next/link";

import BrowseClient from "../../_component/requirements/browse-client";
import type { IProfile, IRequirementWithScore } from "@/interfaces";
import { getMyProfile } from "@/services/profile.service";
import {
  getBrowseRequirements,
  type BrowseRequirementsResult,
} from "@/services/requirement.service";

export const dynamic = "force-dynamic";

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<{
    role?: string | string[];
    industry?: string | string[];
    stage?: string | string[];
  }>;
}) {
  const sp = await searchParams;
  const role = (sp.role ?? "all").toString();
  const industry = (sp.industry ?? "all").toString();
  const stage = (sp.stage ?? "all").toString();

  let profile: IProfile | null = null;
  let requirements: IRequirementWithScore[] = [];
  let nextCursor: BrowseRequirementsResult["nextCursor"] = null;

  try {
    const [profileRes, listRes] = await Promise.all([
      getMyProfile(),
      getBrowseRequirements({ role, industry, stage }),
    ]);
    profile = profileRes;
    requirements = listRes.data;
    nextCursor = listRes.nextCursor;
  } catch {}

  const missingFields: string[] = [];
  if (!profile?.role) missingFields.push("Role");
  if (!profile?.skills || profile.skills.length === 0)
    missingFields.push("Skills");
  if (
    !profile?.interestedIndustries ||
    profile.interestedIndustries.length === 0
  )
    missingFields.push("Industries");
  if (!profile?.availableWeeklyCommitment)
    missingFields.push("Weekly Availability");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold sm:text-2xl">Browse Opportunities</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Open co-founder requirements, ranked by your compatibility score
        </p>
      </div>

      {missingFields.length > 0 && (
        <div className="flex items-start gap-3 rounded-lg border border-warning/20 bg-warning/10 p-4 text-sm">
          <AlertTriangle className="mt-0.5 size-5 shrink-0 text-warning" />
          <div>
            <p className="font-medium text-warning">
              Complete your profile for accurate compatibility scores
            </p>
            <p className="mt-0.5 text-muted-foreground">
              Fill in: {missingFields.join(", ")} —{" "}
              <Link
                href="/profile"
                className="font-medium underline underline-offset-2 hover:text-foreground"
              >
                Edit profile
              </Link>
            </p>
          </div>
        </div>
      )}

      <BrowseClient
        initialRequirements={requirements}
        initialNextCursor={nextCursor}
        initialRole={role}
        initialIndustry={industry}
        initialStage={stage}
      />
    </div>
  );
}
