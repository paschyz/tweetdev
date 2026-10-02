import React, { useRef } from "react";
import { Handle, NodeToolbar, Position, useReactFlow } from "reactflow";
import { ExternalLink, Flag, Play, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { navigateToNewWindow } from "@/utils/utils";

/** The three built-in steps. Programs become "code-node" steps. */
export const STEPS = {
  "run-node": { label: "Run", hint: "Where the workflow starts", icon: Play, tone: "text-success" },
  "upload-node": { label: "Upload", hint: "Hands a file to the next program", icon: Upload, tone: "text-info" },
  "finish-node": { label: "Finish", hint: "Where the workflow ends", icon: Flag, tone: "text-primary" },
} as const;

export function LanguageTag({ language }: { language: string }) {
  const python = language === "python";
  return (
    <span
      className={cn(
        "shrink-0 rounded px-1.5 py-0.5 font-mono text-[11px] font-semibold leading-4",
        python ? "bg-info/15 text-info" : "bg-primary/15 text-primary"
      )}
    >
      {python ? "py" : "js"}
    </span>
  );
}

/** "png → txt". Programs that take or return nothing use "void". */
export function FileTypes({ input, output }: { input?: string; output?: string }) {
  return (
    <span className="font-mono text-[11px] text-muted-foreground">
      {input || "void"} → {output || "void"}
    </span>
  );
}

function StepNode({
  id,
  label,
  icon,
  detail,
  actions,
  target = true,
  source = true,
}: {
  id: string;
  label: string;
  icon: React.ReactNode;
  detail?: React.ReactNode;
  actions?: React.ReactNode;
  target?: boolean;
  source?: boolean;
}) {
  const flow = useReactFlow();
  return (
    <>
      <NodeToolbar className="flex gap-1 rounded-lg border bg-popover p-1 shadow-lg">
        {actions}
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-red-400 hover:text-red-400"
          onClick={() => flow.deleteElements({ nodes: [{ id }] })}
        >
          <Trash2 />
          Remove
        </Button>
      </NodeToolbar>
      {target && <Handle type="target" position={Position.Left} />}
      {source && <Handle type="source" position={Position.Right} />}
      <div className="flex min-w-36 max-w-56 items-center gap-2.5 rounded-lg border bg-card px-3 py-2.5 shadow-md [.selected_&]:border-primary">
        {icon}
        <div className="min-w-0">
          <p className="truncate text-sm font-medium leading-5">{label}</p>
          {detail}
        </div>
      </div>
    </>
  );
}

const stepIcon = (type: keyof typeof STEPS) => {
  const { icon: Icon, tone } = STEPS[type];
  return <Icon className={cn("h-4 w-4 shrink-0", tone)} />;
};

function RunNode({ id, data }) {
  return <StepNode id={id} label={data?.label} icon={stepIcon("run-node")} target={false} />;
}

function FinishNode({ id, data }) {
  return <StepNode id={id} label={data?.label} icon={stepIcon("finish-node")} source={false} />;
}

function UploadNode({ id, data }) {
  const flow = useReactFlow();
  const input = useRef<HTMLInputElement>(null);
  // a File does not survive saving the workflow: after a reload it has to be picked again
  const file: File | null = data?.file instanceof File ? data.file : null;

  const pick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0];
    if (!picked) return;
    flow.setNodes((nodes) =>
      nodes.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, file: picked } } : node
      )
    );
  };

  return (
    <>
      <input ref={input} type="file" className="hidden" onChange={pick} />
      <StepNode
        id={id}
        label={data?.label}
        icon={stepIcon("upload-node")}
        detail={
          <p className="truncate font-mono text-[11px] text-muted-foreground">
            {file ? file.name : "no file yet"}
          </p>
        }
        actions={
          <Button variant="ghost" size="sm" className="h-7 px-2" onClick={() => input.current?.click()}>
            <Upload />
            {file ? "Replace file" : "Choose file"}
          </Button>
        }
      />
    </>
  );
}

function CodeNode({ id, data }) {
  const program = data?.codeData ?? {};
  return (
    <StepNode
      id={id}
      label={data?.label}
      icon={<LanguageTag language={program.language} />}
      detail={<FileTypes input={program.inputFileType} output={program.outputFileType} />}
      actions={
        program._id && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2"
            onClick={() => navigateToNewWindow("/program/" + program._id)}
          >
            <ExternalLink />
            Open program
          </Button>
        )
      }
    />
  );
}

export const nodeTypes = {
  "run-node": RunNode,
  "finish-node": FinishNode,
  "upload-node": UploadNode,
  "code-node": CodeNode,
};
