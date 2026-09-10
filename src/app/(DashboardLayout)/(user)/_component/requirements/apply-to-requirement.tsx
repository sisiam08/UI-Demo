"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { ConfirmDialog } from "../../../../../components/shared/confirm-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { getApiErrorMessage } from "@/lib/api-error";
import { applyToRequirement } from "@/service/requirement.services";

export default function ApplyToRequirement({ requirementId }: { requirementId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleApply() {
    setSubmitting(true);
    try {
      await applyToRequirement(requirementId);
      toast.add({
        type: "success",
        description: "Your application has been submitted.",
      });
      router.push("/applications/mine");
    } catch (error) {
      toast.add({ type: "error", description: getApiErrorMessage(error) });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <div className="flex justify-end">
        <Button
          onClick={() => setOpen(true)}
          size="lg"
          className="w-full sm:w-auto"
          disabled={submitting}
        >
          {submitting ? "Applying..." : "Apply to this requirement"}
        </Button>
      </div>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Apply to this requirement?"
        description="Your current compatibility score will be saved as a snapshot. You can only apply once per requirement."
        confirmLabel="Yes, apply"
        variant="default"
        onConfirm={() => void handleApply()}
      />
    </>
  );
}

