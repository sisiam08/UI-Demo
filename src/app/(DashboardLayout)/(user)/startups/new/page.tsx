import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import StartupForm from "../../_component/startup/startup-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function NewStartupPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <Link
        href="/startups/mine"
        className="-ml-2 inline-flex items-center gap-1 rounded-md px-2.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">New Startup Idea</CardTitle>
          <CardDescription>
            Describe your startup so co-founders can find and apply to it
          </CardDescription>
        </CardHeader>
        <CardContent>
          <StartupForm />
        </CardContent>
      </Card>
    </div>
  );
}
