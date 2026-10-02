import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { updatePassword } from "@/api/user";
import { Field } from "@/components/Field";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { getSession } from "@/services/sessionService";
import { passwordProblem } from "@/utils/utils";

export default function EditPasswordDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<{ current?: string; next?: string; confirm?: string }>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setCurrent("");
    setNext("");
    setConfirm("");
    setErrors({});
  }, [open]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const found = {
      next: passwordProblem(next) || undefined,
      confirm: next !== confirm ? "The two new passwords don't match." : undefined,
    };
    setErrors(found);
    if (found.next || found.confirm) return;

    setSaving(true);
    try {
      await updatePassword(getSession(), { currentPassword: current, newPassword: next });
      toast.success("Password changed");
      onOpenChange(false);
    } catch (error: any) {
      if (error?.response?.status === 400) {
        setErrors({ current: "That isn't your current password." });
      } else {
        toast.error("Couldn't change your password. Try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change password</DialogTitle>
          <DialogDescription>At least 8 characters, no spaces.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="grid gap-4">
          <Field label="Current password" error={errors.current}>
            <Input
              type="password"
              autoComplete="current-password"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              required
            />
          </Field>
          <Field label="New password" error={errors.next}>
            <Input
              type="password"
              autoComplete="new-password"
              value={next}
              onChange={(e) => setNext(e.target.value)}
              required
            />
          </Field>
          <Field label="Repeat new password" error={errors.confirm}>
            <Input
              type="password"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          </Field>
          <DialogFooter className="gap-2 sm:space-x-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              Change password
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
