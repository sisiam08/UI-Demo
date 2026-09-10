import { Megaphone } from "lucide-react";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AdminBroadcastPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Broadcast Announcement</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Send a system announcement notification to all or a segment of users
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Megaphone className="size-5" />
            Coming Soon
          </CardTitle>
          <CardDescription>
            The broadcast feature is not yet available. You will be able to send
            system-wide announcements here once it is implemented.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
