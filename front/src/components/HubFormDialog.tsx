import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { createHub, updateHub } from "@/api/hub";
import { Field } from "@/components/Field";
import { HubTile } from "@/components/HubTile";
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
import { IHub } from "@/interfaces/IHub";
import { refresh } from "@/lib/lookups";
import { getSession } from "@/services/sessionService";

const blank = { name: "", description: "", profileImageUrl: "", coverImageUrl: "" };

/** Creates a hub, or edits `hub` when one is passed. */
export default function HubFormDialog({
  hub,
  open,
  onOpenChange,
}: {
  hub?: IHub;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const navigate = useNavigate();
  const [form, setForm] = useState(blank);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm(
      hub
        ? {
            name: hub.name,
            description: hub.description ?? "",
            profileImageUrl: hub.profileImageUrl ?? "",
            coverImageUrl: hub.coverImageUrl ?? "",
          }
        : blank
    );
  }, [open]);

  const set =
    (key: keyof typeof blank) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm({ ...form, [key]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = form.name.trim();
    const seed = encodeURIComponent(name);
    const data = {
      name,
      description: form.description.trim(),
      // the API requires both images
      profileImageUrl:
        form.profileImageUrl.trim() || `https://picsum.photos/seed/${seed}-icon/200`,
      coverImageUrl:
        form.coverImageUrl.trim() || `https://picsum.photos/seed/${seed}/1200/400`,
    };
    setSaving(true);
    try {
      if (hub) await updateHub(getSession(), encodeURIComponent(hub.name), data);
      else await createHub(getSession(), data);
      toast.success(hub ? "Hub updated" : "Hub created");
      refresh();
      onOpenChange(false);
      navigate("/hub/" + encodeURIComponent(name));
    } catch {
      toast.error(
        hub
          ? "Couldn't update the hub. Try again."
          : "Couldn't create the hub. That name may already be taken."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{hub ? "Edit hub" : "Create a hub"}</DialogTitle>
          <DialogDescription>
            A hub is a place to post about one topic. Anyone can follow it.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="grid gap-4">
          <HubTile hub={{ ...form, users: hub?.users }} link={false} />
          <Field label="Name">
            <Input value={form.name} onChange={set("name")} required maxLength={40} autoFocus />
          </Field>
          <Field label="Description">
            <Textarea
              value={form.description}
              onChange={set("description")}
              rows={3}
              required
              placeholder="What is this hub about?"
            />
          </Field>
          <Field label="Icon URL" hint="Leave empty to get a generated image.">
            <Input
              type="url"
              value={form.profileImageUrl}
              onChange={set("profileImageUrl")}
              placeholder="https://"
            />
          </Field>
          <Field label="Banner URL" hint="Leave empty to get a generated image.">
            <Input
              type="url"
              value={form.coverImageUrl}
              onChange={set("coverImageUrl")}
              placeholder="https://"
            />
          </Field>
          <DialogFooter className="gap-2 sm:space-x-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {hub ? "Save changes" : "Create hub"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
