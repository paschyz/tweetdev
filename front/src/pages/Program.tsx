import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Editor } from "@monaco-editor/react";
import { Download, Loader2, Paperclip, Play, Save, X } from "lucide-react";
import { toast } from "sonner";
import {
  createProgram,
  executeProgram,
  fetchProgramById,
  getIsProgramDeletable,
  updateProgram,
} from "../api/programs";
import { EmptyState } from "../components/FeedItem";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Skeleton } from "../components/ui/skeleton";
import { CODE_SNIPPETS, LANGUAGE_VERSIONS } from "../constants";
import { cn } from "../lib/utils";
import { getSession } from "../services/sessionService";

// "void" = the program takes (or returns) no file
const FILE_TYPES = [
  "void", "txt", "png", "jpg", "py", "js", "pdf", "csv", "doc", "docx",
  "xlsx", "ppt", "pptx", "zip", "rar", "mp3", "mp4",
];

type Run =
  | { state: "idle" | "running" }
  | { state: "done"; text?: string; fileUrl?: string }
  | { state: "error"; text: string };

// same ink as the page, so the editor does not look like an embed
const defineTheme = (monaco: any) =>
  monaco.editor.defineTheme("tweetdev", {
    base: "vs-dark",
    inherit: true,
    rules: [],
    colors: {
      "editor.background": "#0e1220",
      "editorGutter.background": "#0e1220",
      "editor.lineHighlightBackground": "#151a2b",
      "editorLineNumber.foreground": "#4b5578",
    },
  });

function TypeSelect({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-muted-foreground">
      {label}
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger className="h-8 w-24 font-mono text-xs text-foreground">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {FILE_TYPES.map((type) => (
            <SelectItem key={type} value={type} className="font-mono text-xs">
              {type}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </label>
  );
}

/** The code editor: creates a program at /program, opens an existing one at /program/:id. */
export default function Program() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const fileInput = useRef<HTMLInputElement>(null);

  const [status, setStatus] = useState<"loading" | "ready" | "missing">(id ? "loading" : "ready");
  const [canEdit, setCanEdit] = useState(!id);
  const [name, setName] = useState("Untitled program");
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState<string>(CODE_SNIPPETS.python);
  const [inputType, setInputType] = useState("void");
  const [outputType, setOutputType] = useState("void");
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [run, setRun] = useState<Run>({ state: "idle" });
  const fileUrl = run.state === "done" ? run.fileUrl : undefined;

  useEffect(() => {
    if (!id) return;
    const token = getSession();
    setStatus("loading");
    fetchProgramById(token, id)
      .then((program) => {
        if (!program) return setStatus("missing");
        setName(program.name);
        setLanguage(program.language);
        setCode(program.content ?? "");
        setInputType(program.inputFileType || "void");
        setOutputType(program.outputFileType || "void");
        setStatus("ready");
      })
      .catch(() => setStatus("missing"));
    getIsProgramDeletable(token, id)
      .then((can) => setCanEdit(!!can))
      .catch(() => setCanEdit(false));
  }, [id]);

  useEffect(() => () => fileUrl && URL.revokeObjectURL(fileUrl), [fileUrl]);

  const changeLanguage = (next: string) => {
    // a new program still showing the starter snippet gets the other language's snippet
    if (!id && code === CODE_SNIPPETS[language]) setCode(CODE_SNIPPETS[next]);
    setLanguage(next);
  };

  const changeInputType = (next: string) => {
    setInputType(next);
    setFile(null);
  };

  const pickFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const picked = event.target.files?.[0];
    event.target.value = ""; // picking the same file again must fire a change
    if (!picked) return;
    if (picked.name.split(".").pop()?.toLowerCase() !== inputType) {
      toast.error(`This program takes a .${inputType} file.`);
      return;
    }
    setFile(picked);
  };

  const save = async () => {
    const content = {
      name,
      content: code,
      language,
      inputFileType: inputType,
      outputFileType: outputType,
    };
    setSaving(true);
    try {
      if (id) {
        await updateProgram(getSession(), id, content);
        toast.success("Program saved");
      } else {
        const created = await createProgram(getSession(), content);
        toast.success("Program created");
        navigate(created?._id ? "/program/" + created._id : "/");
      }
    } catch {
      toast.error(id ? "Couldn't save the program. Try again." : "Couldn't create the program. Try again.");
    } finally {
      setSaving(false);
    }
  };

  const runCode = async () => {
    setRun({ state: "running" });
    const formData = new FormData();
    formData.append("language", language);
    formData.append("code", code);
    formData.append("inputFileType", inputType);
    formData.append("outputFileType", outputType);
    if (file) formData.append("file", file);

    try {
      const result = await executeProgram(getSession(), formData);
      setRun(
        outputType === "void"
          ? { state: "done", text: String(result ?? "") }
          : { state: "done", fileUrl: URL.createObjectURL(result) }
      );
    } catch (error: any) {
      // the body is a Blob when a file was expected back
      const data = error?.response?.data;
      const text = data instanceof Blob ? await data.text() : data?.message ?? data;
      setRun({
        state: "error",
        text:
          (typeof text === "string" && text) ||
          "The program couldn't be run. Check that the code runner is up, then run it again.",
      });
    }
  };

  if (status === "missing") {
    return (
      <EmptyState title="This program doesn't exist">
        The link may be wrong, or its author deleted it.
      </EmptyState>
    );
  }

  const running = run.state === "running";

  return (
    <div className="flex h-[calc(100dvh-3.5rem)] flex-col lg:h-dvh">
      <div className="flex flex-wrap items-center gap-2 border-b px-3 py-2.5 sm:px-4">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={!canEdit}
          aria-label="Program name"
          className="h-9 w-full font-semibold disabled:opacity-100 sm:w-64"
        />
        <Select value={language} onValueChange={changeLanguage} disabled={!canEdit}>
          <SelectTrigger className="h-9 w-36" aria-label="Language">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(LANGUAGE_VERSIONS).map((lang) => (
              <SelectItem key={lang} value={lang}>
                {lang === "javascript" ? "JavaScript" : "Python"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="ml-auto flex gap-2">
          {canEdit && (
            <Button variant="outline" onClick={save} disabled={saving || !name.trim()}>
              <Save />
              {id ? "Save" : "Create program"}
            </Button>
          )}
          <Button onClick={runCode} disabled={running || status !== "ready"}>
            {running ? <Loader2 className="animate-spin [animation-duration:0.6s]" /> : <Play />}
            Run
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-b px-3 py-2 sm:px-4">
        <TypeSelect label="Takes" value={inputType} onChange={changeInputType} disabled={!canEdit} />
        {inputType !== "void" && (
          <>
            <input
              ref={fileInput}
              type="file"
              accept={"." + inputType}
              className="hidden"
              onChange={pickFile}
            />
            {file ? (
              <span className="inline-flex h-8 max-w-56 items-center gap-1.5 rounded-md border pl-2.5 pr-1 text-xs">
                <Paperclip className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <span className="truncate font-mono">{file.name}</span>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  aria-label="Remove file"
                  className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            ) : (
              <Button variant="outline" size="sm" onClick={() => fileInput.current?.click()}>
                <Paperclip />
                Choose a .{inputType} file
              </Button>
            )}
          </>
        )}
        <TypeSelect label="Returns" value={outputType} onChange={setOutputType} disabled={!canEdit} />
        {id && !canEdit && status === "ready" && (
          <p className="text-xs text-muted-foreground sm:ml-auto">
            Read-only. You can run it; only its author can change it.
          </p>
        )}
      </div>

      <div className="grid min-h-0 flex-1 grid-rows-[minmax(0,3fr)_minmax(0,2fr)] lg:grid-cols-2 lg:grid-rows-1">
        <div className="min-h-0 border-b lg:border-b-0 lg:border-r">
          {status === "loading" ? (
            <div className="space-y-3 p-4">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-3/5" />
            </div>
          ) : (
            <Editor
              height="100%"
              theme="tweetdev"
              beforeMount={defineTheme}
              language={language}
              value={code}
              onChange={(value) => setCode(value ?? "")}
              loading={<span className="text-sm text-muted-foreground">Loading editor…</span>}
              options={{
                readOnly: !canEdit,
                minimap: { enabled: false },
                fontFamily: '"JetBrains Mono", ui-monospace, monospace',
                fontSize: 13,
                padding: { top: 14 },
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
            />
          )}
        </div>

        <div className="flex min-h-0 flex-col bg-well" aria-live="polite">
          <div className="flex h-10 shrink-0 items-center justify-between border-b px-4 text-sm">
            <span className="font-medium">Output</span>
            {run.state === "error" && <span className="text-red-400">Failed</span>}
            {running && <span className="text-muted-foreground">Running…</span>}
          </div>
          <div className="min-h-0 flex-1 overflow-auto p-4">
            {run.state === "idle" && (
              <p className="text-sm text-muted-foreground">
                Press Run and the output shows up here.
              </p>
            )}
            {run.state === "done" && fileUrl && (
              <div className="text-sm">
                <p className="mb-3">The program returned a .{outputType} file.</p>
                <Button asChild variant="outline" size="sm">
                  <a href={fileUrl} download={"output." + outputType}>
                    <Download />
                    Download output.{outputType}
                  </a>
                </Button>
              </div>
            )}
            {(run.state === "error" || (run.state === "done" && !fileUrl)) && (
              <pre
                className={cn(
                  "whitespace-pre-wrap break-words font-mono text-[13px] leading-relaxed",
                  run.state === "error" && "text-red-400"
                )}
              >
                {run.text || <span className="font-sans text-muted-foreground">The program printed nothing.</span>}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
