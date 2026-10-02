import React, { useEffect, useState } from "react";
import { fetchPrograms } from "@/api/programs";
import { cn } from "@/lib/utils";
import { getSession } from "@/services/sessionService";
import { FileTypes, LanguageTag, STEPS } from "./nodes";

type AddStep = (type: string, label: string, codeData?: any) => void;

const row =
  "flex w-full cursor-grab items-center gap-2.5 rounded-lg border bg-card px-3 py-2 text-left transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:cursor-grabbing";

/** Drag a step onto the canvas, or click it (drag does not exist on touch screens). */
function Step({
  type,
  label,
  codeData,
  onAdd,
  children,
}: {
  type: string;
  label: string;
  codeData?: any;
  onAdd: AddStep;
  children: React.ReactNode;
}) {
  const onDragStart = (event: React.DragEvent) => {
    event.dataTransfer.setData("application/reactflow", type);
    event.dataTransfer.setData("application/reactflow/node/name", label);
    if (codeData) {
      event.dataTransfer.setData(
        "application/reactflow/codeData",
        JSON.stringify(codeData)
      );
    }
    event.dataTransfer.effectAllowed = "move";
  };
  return (
    <button
      type="button"
      draggable
      onDragStart={onDragStart}
      onClick={() => onAdd(type, label, codeData)}
      className={row}
    >
      {children}
    </button>
  );
}

const heading = "mb-2 text-sm font-semibold";

function WorkflowSideBar({
  workflows,
  selectedId,
  onSelect,
  onAdd,
}: {
  workflows: any[];
  selectedId?: string;
  onSelect: (workflow: any) => void;
  onAdd: AddStep;
}) {
  const [programs, setPrograms] = useState<any[]>([]);

  useEffect(() => {
    fetchPrograms(getSession())
      .then(setPrograms)
      .catch(() => setPrograms([]));
  }, []);

  return (
    <div className="flex flex-col gap-6 p-4">
      {workflows.length > 0 && (
        <section>
          <h2 className={heading}>Workflows</h2>
          <div className="flex flex-col gap-1">
            {workflows.map((workflow) => (
              <button
                key={workflow._id}
                type="button"
                onClick={() => onSelect(workflow)}
                aria-current={selectedId === workflow._id}
                className={cn(
                  "rounded-lg px-3 py-2 text-left transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  selectedId === workflow._id && "bg-accent"
                )}
              >
                <p className="truncate text-sm font-medium">{workflow.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  by {workflow.username}
                </p>
              </button>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className={heading}>Steps</h2>
        <p className="mb-3 text-xs text-muted-foreground">
          Drag onto the canvas, or click to add.
        </p>
        <div className="flex flex-col gap-2">
          {Object.entries(STEPS).map(([type, { label, hint, icon: Icon, tone }]) => (
            <Step key={type} type={type} label={label} onAdd={onAdd}>
              <Icon className={cn("h-4 w-4 shrink-0", tone)} />
              <span className="min-w-0">
                <span className="block text-sm font-medium">{label}</span>
                <span className="block text-xs text-muted-foreground">{hint}</span>
              </span>
            </Step>
          ))}
        </div>
      </section>

      <section>
        <h2 className={heading}>Programs</h2>
        {programs.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            No programs yet. Create one to use it as a step.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {programs.map((program) => (
              <Step
                key={program._id}
                type="code-node"
                label={program.name}
                codeData={program}
                onAdd={onAdd}
              >
                <LanguageTag language={program.language} />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium">
                    {program.name}
                  </span>
                  <span className="flex gap-2 text-xs text-muted-foreground">
                    <span className="truncate">{program.username}</span>
                    <FileTypes
                      input={program.inputFileType}
                      output={program.outputFileType}
                    />
                  </span>
                </span>
              </Step>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default WorkflowSideBar;
