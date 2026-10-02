import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { updateUser } from "@/api/user";
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
import { Textarea } from "@/components/ui/textarea";
import { refresh } from "@/lib/lookups";
import { getSession } from "@/services/sessionService";

export default function EditProfileDialog({
  user,
  open,
  onOpenChange,
}: {
  user: UserResponse;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    description: "",
    profileImageUrl: "",
    backgroundImageUrl: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm({
      username: user.username,
      description: user.description ?? "",
      profileImageUrl: user.profileImageUrl ?? "",
      backgroundImageUrl: user.backgroundImageUrl ?? "",
    });
  }, [open]);

  const set =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm({ ...form, [key]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const username = form.username.trim();
    setSaving(true);
    try {
      await updateUser(getSession(), { ...form, username });
      localStorage.setItem("username", JSON.stringify(username));
      toast.success("Profile updated");
      refresh();
      onOpenChange(false);
      navigate("/profile/" + encodeURIComponent(username), { replace: true });
    } catch {
      toast.error("Couldn't update your profile. That username may already be taken.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>This is how other developers see you.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="grid gap-4">
          <Field label="Username">
            <Input value={form.username} onChange={set("username")} required maxLength={40} />
          </Field>
          <Field label="Bio">
            <Textarea value={form.description} onChange={set("description")} rows={3} />
          </Field>
          <Field label="Avatar URL">
            <Input
              type="url"
              value={form.profileImageUrl}
              onChange={set("profileImageUrl")}
              placeholder="https://"
            />
          </Field>
          <Field label="Banner URL">
            <Input
              type="url"
              value={form.backgroundImageUrl}
              onChange={set("backgroundImageUrl")}
              placeholder="https://"
            />
          </Field>
          <DialogFooter className="gap-2 sm:space-x-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
