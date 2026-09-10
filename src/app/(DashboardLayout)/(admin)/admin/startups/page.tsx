import { StartupsClient } from "../../_component/startups-client";
import {
  getAdminStartups,
  type AdminStartupsPage,
} from "@/services/admin.service";

export const dynamic = "force-dynamic";

export default async function AdminStartupsPage() {
  let data: AdminStartupsPage = { startups: [], total: 0, page: 1, limit: 20 };
  try {
    data = await getAdminStartups({ page: 1 });
  } catch {
    data = { startups: [], total: 0, page: 1, limit: 20 };
  }

  return (
    <StartupsClient
      initialStartups={data.startups}
      initialTotal={data.total}
      initialLimit={data.limit}
    />
  );
}
