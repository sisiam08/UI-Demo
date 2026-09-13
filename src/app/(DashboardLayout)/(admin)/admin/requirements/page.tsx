import type { AdminRequirementsPage } from "@/interfaces";
import { RequirementsClient } from "../../_component/requirement/requirements-client";
import { getAdminRequirements } from "@/services/admin.service";

export const dynamic = "force-dynamic";

export default async function AdminRequirementsPage() {
  let data: AdminRequirementsPage = {
    requirements: [],
    total: 0,
    page: 1,
    limit: 20,
  };
  let initialError: string | undefined;
  try {
    data = await getAdminRequirements({ page: 1 });
  } catch {
    initialError = "Unable to load requirements.";
  }

  return (
    <RequirementsClient
      initialRequirements={data.requirements}
      initialTotal={data.total}
      initialLimit={data.limit}
      initialError={initialError}
    />
  );
}
