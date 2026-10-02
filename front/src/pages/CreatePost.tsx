import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MDEditor from "@uiw/react-md-editor";
import { toast } from "sonner";
import { createPost } from "../api/post";
import { fetchPrograms } from "../api/programs";
import { fetchUserHubs } from "../api/user";
import { Field } from "../components/Field";
import { Button } from "../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { IHub } from "../interfaces/IHub";
import { getSession } from "../services/sessionService";

const NONE = "none"; // Select items cannot have an empty value

export default function CreatePost() {
  const navigate = useNavigate();
  const [value, setValue] = useState("");
  const [userHubs, setUserHubs] = useState<IHub[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const [hubname, setHubname] = useState(NONE);
  const [programId, setProgramId] = useState(NONE);
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    const token = getSession();
    fetchUserHubs(token).then(setUserHubs).catch(() => {});
    fetchPrograms(token).then(setPrograms).catch(() => {});
  }, []);

  const submitPost = async () => {
    setPublishing(true);
    try {
      await createPost(getSession(), {
        content: value,
        hubname: hubname === NONE ? undefined : hubname,
        program: programId === NONE ? undefined : programId,
      });
      toast.success("Post published");
      navigate("/");
    } catch {
      toast.error("Couldn't publish the post. Try again.");
      setPublishing(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 lg:py-8">
      <h1 className="text-2xl font-bold tracking-tight">New post</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Write in Markdown. Fenced code blocks are highlighted.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field label="Post in" hint="Only hubs you follow are listed.">
          <Select value={hubname} onValueChange={setHubname}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NONE}>Your profile only</SelectItem>
              {userHubs.map((hub) => (
                <SelectItem key={hub._id} value={hub.name}>
                  {hub.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Attach a program" hint="Readers can open and run it.">
          <Select value={programId} onValueChange={setProgramId}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NONE}>No program</SelectItem>
              {programs.map((program) => (
                <SelectItem key={program._id} value={program._id}>
                  {program.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>

      <div className="mt-4">
        <MDEditor
          value={value}
          onChange={(text) => setValue(text ?? "")}
          height={380}
          // side-by-side preview needs width: phones get the editor alone
          preview={window.matchMedia("(min-width: 640px)").matches ? "live" : "edit"}
          textareaProps={{
            placeholder: "What did you build, break or learn today?",
            "aria-label": "Post content",
          }}
        />
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <Button variant="outline" onClick={() => navigate(-1)}>
          Cancel
        </Button>
        <Button onClick={submitPost} disabled={publishing || !value.trim()}>
          Publish
        </Button>
      </div>
    </div>
  );
}
