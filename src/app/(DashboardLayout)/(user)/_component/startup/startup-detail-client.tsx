"use client";

import { useState } from "react";

import { Plus, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { MultiSelect } from "@/components/shared/multi-select";
import { SKILL_OPTIONS } from "@/constants/options";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/toast";
import { PROFILE_ROLE_OPTIONS } from "@/constants/options";
import type { IStartupIdea, ProfileRole } from "@/interfaces";
import { getApiErrorMessage } from "@/lib/api-error";
import { addRequirement } from "@/services/startup.service";

export default function StartupDetailClient({
  id,
  initialStartup,
}: {
  id: string;
  initialStartup: IStartupIdea;
}) {
  const router = useRouter();
  const isOpen = initialStartup.status === "open";

  const [showAddReq, setShowAddReq] = useState(false);
  const [newReq, setNewReq] = useState({
    requiredRole: "technical" as ProfileRole,
    requiredSkills: [] as string[],
    requiredWeeklyCommitment: "",
    equityOffered: "",
  });

  async function handleAddRequirement() {
    try {
      await addRequirement(id, {
        requiredRole: newReq.requiredRole,
        requiredSkills: newReq.requiredSkills,
        requiredWeeklyCommitment: Number(newReq.requiredWeeklyCommitment),
        equityOffered: Number(newReq.equityOffered),
      });
      toast.add({ type: "success", description: "Requirement added" });
      setShowAddReq(false);
      setNewReq({
        requiredRole: "technical",
        requiredSkills: [],
        requiredWeeklyCommitment: "",
        equityOffered: "",
      });
      router.refresh();
    } catch (error) {
      toast.add({ type: "error", description: getApiErrorMessage(error) });
    }
  }

  const requirements = initialStartup.requirements ?? [];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold">Requirements</h2>
        {isOpen && (
          <Button
            size="sm"
            onClick={() => setShowAddReq((v) => !v)}
            className="w-full sm:w-auto"
          >
            <Plus className="size-4" />
            Add Requirement
          </Button>
        )}
      </div>

      {showAddReq && (
        <Card>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Required role</Label>
              <Select
                value={newReq.requiredRole}
                onValueChange={(v) =>
                  setNewReq({ ...newReq, requiredRole: v as ProfileRole })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PROFILE_ROLE_OPTIONS.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Required skills</Label>
              <MultiSelect
                value={newReq.requiredSkills}
                onChange={(v) => setNewReq({ ...newReq, requiredSkills: v })}
                options={SKILL_OPTIONS}
                placeholder="Search or type a skill..."
                allowCustom
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="reqCommitment">Weekly commitment (h)</Label>
                <Input
                  id="reqCommitment"
                  type="number"
                  min={1}
                  value={newReq.requiredWeeklyCommitment}
                  onChange={(e) =>
                    setNewReq({
                      ...newReq,
                      requiredWeeklyCommitment: e.target.value,
                    })
                  }
                  placeholder="Hours per week"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reqEquity">Equity offered (%)</Label>
                <Input
                  id="reqEquity"
                  type="number"
                  min={0}
                  max={100}
                  step="0.01"
                  value={newReq.equityOffered}
                  onChange={(e) =>
                    setNewReq({ ...newReq, equityOffered: e.target.value })
                  }
                  placeholder="Percentage offered"
                  required
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="button" onClick={handleAddRequirement}>
                Add Requirement
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddReq(false)}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {requirements.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-8 text-center">
            <p className="text-sm text-muted-foreground">
              No requirements yet. Add one to start receiving applications.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {requirements.map((req) => (
            <Card key={req.id}>
              <CardContent className="flex items-start justify-between gap-4 p-5">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold capitalize">
                      {req.requiredRole}
                    </span>
                    <StatusBadge status={req.status} />
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {req.requiredSkills.map((skill) => (
                      <span
                        key={skill}
                        className="shrink-0 rounded-md border border-border px-2 py-0.5 text-xs font-medium text-foreground"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {req.requiredWeeklyCommitment}h/week ·{" "}
                    {Number(req.equityOffered)}% equity
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  nativeButton={false}
                  render={
                    <Link href={`/requirements/${req.id}/applications`} />
                  }
                >
                  <Users className="size-4" />
                  Applicants
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
