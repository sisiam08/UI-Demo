"use client";

import { useState } from "react";

import { Archive, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { getApiErrorMessage } from "@/lib/api-error";
import { closeStartup, deleteStartup } from "@/services/startup.service";

export default function StartupActions({
  id,
  status,
}: {
  id: string;
  status: string;
}) {
  const router = useRouter();
  const isOpen = status === "open";
  const [confirmClose, setConfirmClose] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  async function handleClose() {
    try {
      await closeStartup(id);
      toast.add({ type: "success", description: "Startup closed" });
      router.refresh();
    } catch (error) {
      toast.add({ type: "error", description: getApiErrorMessage(error) });
    }
  }

  async function handleDelete() {
    try {
      await deleteStartup(id);
      toast.add({ type: "success", description: "Startup deleted" });
      router.push("/startups/mine");
    } catch (error) {
      toast.add({ type: "error", description: getApiErrorMessage(error) });
    }
  }

  return (
    <>
      <div className="flex shrink-0 gap-2">
        <Button
          variant="outline"
          size="sm"
          nativeButton={false}
          render={<Link href={`/startups/${id}/edit`} />}
        >
          <Pencil className="size-4" />
          Edit
        </Button>
        {isOpen && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setConfirmClose(true)}
          >
            <Archive className="size-4" />
            Close
          </Button>
        )}
        <Button
          variant="destructive"
          size="sm"
          onClick={() => setConfirmDelete(true)}
        >
          <Trash2 className="size-4" />
          Delete
        </Button>
      </div>

      <ConfirmDialog
        open={confirmClose}
        onOpenChange={setConfirmClose}
        title="Close this startup idea?"
        description="It will no longer appear in browse results. You can still view it."
        confirmLabel="Close"
        onConfirm={() => void handleClose()}
      />
      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title="Delete this startup idea?"
        description="This is irreversible. All its requirements and applications will be deleted too."
        confirmLabel="Delete permanently"
        variant="destructive"
        onConfirm={() => void handleDelete()}
      />
    </>
  );
}
