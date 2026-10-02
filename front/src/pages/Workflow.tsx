import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactFlow, {
  addEdge,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  Panel,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";
import {
  Copy,
  Download,
  GitBranchPlus,
  Loader2,
  MoreHorizontal,
  Play,
  Plus,
  Save,
  Shapes,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { executePipeline } from "../api/programs";
import {
  cloningWorkflow,
  createWorkflow,
  deleteWorkflow,
  deleteWorkflowVersionByIdandName,
  fetchWorkflowById,
  fetchWorkflows,
  getIsWorkflowDeletable,
  updateWorkflow,
  updateWorkflowName,
  upgradeWorkflow,
} from "../api/workflow";
import { ConfirmDialog } from "../components/DeleteMenu";
import { EmptyState } from "../components/FeedItem";
import { Button } from "../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "../components/ui/sheet";
import { nodeTypes } from "../components/workflow/nodes";
import WorkflowSideBar from "../components/workflow/WorkflowSideBar";
import { getSession } from "../services/sessionService";

// saved flows keep their node ids: a plain counter would collide with them after a reload
let created = 0;
const getId = () => `dndnode_${Date.now()}_${created++}`;

type StepResult = { label: string; text?: string; fileUrl?: string; fileName?: string; error?: string };

/** /workflow lists every workflow; /workflow/:id opens that one. */
const WorkflowEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const canvas = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition, toObject, fitView } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const [status, setStatus] = useState<"loading" | "ready" | "missing">("loading");
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [canEdit, setCanEdit] = useState(false);
  const [name, setName] = useState("");
  const [version, setVersion] = useState("");
  const [results, setResults] = useState<StepResult[] | null>(null);
  const [running, setRunning] = useState(false);
  const [confirming, setConfirming] = useState<"workflow" | "version" | null>(null);
  const [stepsOpen, setStepsOpen] = useState(false);

  const versions: any[] = selected?.versions ?? [];

  /** Puts a workflow on the canvas: the given version, or its latest. */
  const show = (workflow: any, versionName?: string) => {
    const all: any[] = workflow.versions ?? [];
    const shown = all.find((v) => v.name === versionName) ?? all[all.length - 1];
    setSelected(workflow);
    setName(workflow.name);
    setVersion(shown?.name ?? "");
    setNodes(shown?.content?.nodes ?? []);
    setEdges(shown?.content?.edges ?? []);
    setResults(null);
    // wait for the new nodes to be measured
    setTimeout(() => fitView({ padding: 0.3, maxZoom: 1 }), 50);
  };

  /** (Re)loads from the API and shows `selectId`, else the first workflow. */
  const load = async (selectId?: string) => {
    const token = getSession();
    try {
      if (id) {
        const one = await fetchWorkflowById(token, id);
        if (!one) return setStatus("missing");
        show(one);
      } else {
        const all = await fetchWorkflows(token);
        setWorkflows(all);
        const pick = all.find((w) => w._id === selectId) ?? all[0];
        if (pick) show(pick);
        else {
          setSelected(null);
          setNodes([]);
          setEdges([]);
        }
      }
      setStatus("ready");
    } catch {
      setStatus(id ? "missing" : "ready");
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  useEffect(() => {
    setCanEdit(false);
    if (!selected?._id) return;
    getIsWorkflowDeletable(getSession(), selected._id)
      .then((can) => setCanEdit(!!can))
      .catch(() => {});
  }, [selected?._id]);

  const addStep = useCallback(
    (type: string, label: string, codeData?: any, at?: { x: number; y: number }) => {
      // no drop point (added by click): centre of the canvas, nudged so steps do not stack
      const box = canvas.current?.getBoundingClientRect();
      const nudge = (nodes.length % 6) * 28;
      const position = screenToFlowPosition(
        at ?? {
          x: (box?.left ?? 0) + (box?.width ?? 0) / 2 - 70 + nudge,
          y: (box?.top ?? 0) + (box?.height ?? 0) / 2 - 20 + nudge,
        }
      );
      setNodes((current) =>
        current.concat({
          id: getId(),
          type,
          position,
          data: codeData ? { label, codeData } : { label },
        })
      );
      setStepsOpen(false);
    },
    [screenToFlowPosition, nodes.length]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const type = event.dataTransfer.getData("application/reactflow");
      if (!type) return;
      const label = event.dataTransfer.getData("application/reactflow/node/name");
      const codeData = event.dataTransfer.getData("application/reactflow/codeData");
      addStep(type, label, codeData ? JSON.parse(codeData) : undefined, {
        x: event.clientX,
        y: event.clientY,
      });
    },
    [addStep]
  );

  const onConnect = useCallback(
    (params) => {
      const targetHasInput = edges.some((edge) => edge.target === params.target);
      const sourceHasOutput = edges.some((edge) => edge.source === params.source);
      if (targetHasInput || sourceHasOutput) {
        toast.error("A step can have only one input and one output.");
        return;
      }
      setEdges((current) => addEdge(params, current));
    },
    [edges, setEdges]
  );

  const rename = async () => {
    if (!name.trim() || name === selected.name) return;
    try {
      await updateWorkflowName(getSession(), selected._id, { name });
      const renamed = { ...selected, name };
      setSelected(renamed);
      setWorkflows((all) => all.map((w) => (w._id === renamed._id ? renamed : w)));
      toast.success("Workflow renamed");
    } catch {
      toast.error("Couldn't rename the workflow. Try again.");
    }
  };

  const save = async () => {
    try {
      await updateWorkflow(getSession(), selected._id, { content: toObject() });
      if (name.trim() && name !== selected.name) {
        await updateWorkflowName(getSession(), selected._id, { name });
      }
      toast.success("Workflow saved");
      load(selected._id);
    } catch {
      toast.error("Couldn't save the workflow. Try again.");
    }
  };

  const saveAsNewVersion = async () => {
    try {
      await upgradeWorkflow(getSession(), selected._id, { content: toObject() });
      toast.success("Saved as a new version");
      load(selected._id);
    } catch {
      toast.error("Couldn't save a new version. Try again.");
    }
  };

  /** After creating or duplicating: open the new workflow. */
  const open = (workflow: any) => {
    if (id) navigate(workflow?._id ? "/workflow/" + workflow._id : "/workflow");
    else load(workflow?._id);
  };

  const createNew = async () => {
    try {
      open(await createWorkflow(getSession(), { name: "Untitled workflow", content: toObject() }));
      toast.success("Workflow created");
    } catch {
      toast.error("Couldn't create the workflow. Try again.");
    }
  };

  const duplicate = async () => {
    try {
      open(
        await cloningWorkflow(getSession(), {
          name: selected.name + " copy",
          content: toObject(),
        })
      );
      toast.success("Workflow duplicated");
    } catch {
      toast.error("Couldn't duplicate the workflow. Try again.");
    }
  };

  const remove = async () => {
    try {
      await deleteWorkflow(getSession(), selected._id);
      toast.success("Workflow deleted");
      if (id) navigate("/workflow");
      else load();
    } catch {
      toast.error("Couldn't delete the workflow. Try again.");
    }
  };

  const removeVersion = async () => {
    try {
      await deleteWorkflowVersionByIdandName(getSession(), selected._id, {
        versionName: version,
      } as any);
      toast.success(`Version ${version} deleted`);
      load(selected._id);
    } catch {
      toast.error("Couldn't delete the version. Try again.");
    }
  };

  /** Walks the chain from Run, executing each program and handing its file to the next step. */
  const runWorkflow = async () => {
    const start = nodes.find((node) => node.type === "run-node");
    if (!start || !nodes.some((node) => node.type === "finish-node")) {
      toast.error("Add a Run step and a Finish step, then connect them.");
      return;
    }

    const token = getSession();
    const done: StepResult[] = [];
    const visited = new Set<string>();
    let carried: File | null = null;
    let current = start;
    let outcome: "finished" | "failed" | "disconnected" = "disconnected";

    setRunning(true);
    setResults([]);
    while (current && !visited.has(current.id)) {
      visited.add(current.id);
      const label = current.data.label;

      if (current.type === "finish-node") {
        outcome = "finished";
        break;
      }
      if (current.type === "upload-node") {
        if (current.data.file instanceof File) {
          carried = current.data.file;
          done.push({ label, text: `Passing ${carried.name} to the next step.` });
        } else {
          done.push({ label, error: "No file chosen. Select this step and choose one." });
          outcome = "failed";
        }
      }
      if (current.type === "code-node") {
        const { language, outputFileType, content } = current.data.codeData ?? {};
        const formData = new FormData();
        formData.append("language", language);
        formData.append("code", content);
        formData.append("outputFileType", outputFileType);
        if (carried) formData.append("file", carried);
        carried = null;

        try {
          const result = await executePipeline(token, formData);
          if (outputFileType === "void") {
            done.push({ label, text: String(result ?? "") });
          } else {
            const fileName = "output." + outputFileType;
            carried = new File([result], fileName, { type: result.type });
            done.push({ label, fileName, fileUrl: URL.createObjectURL(result) });
          }
        } catch (error: any) {
          const data = error?.response?.data;
          const text = data instanceof Blob ? await data.text() : data?.message ?? data;
          done.push({ label, error: (typeof text === "string" && text) || "This step failed to run." });
          outcome = "failed";
        }
      }
      setResults([...done]);
      if (outcome === "failed") break;

      const edge = edges.find((e) => e.source === current.id);
      current = edge && nodes.find((node) => node.id === edge.target);
    }
    setRunning(false);

    if (outcome === "finished") toast.success("Workflow finished");
    else if (outcome === "failed") toast.error(`Workflow stopped at "${done[done.length - 1].label}".`);
    else toast.error("The run never reached Finish. Connect every step in one chain.");
  };

  if (status === "missing") {
    return (
      <EmptyState title="This workflow doesn't exist">
        The link may be wrong, or its author deleted it.
      </EmptyState>
    );
  }

  const sidebar = (
    <WorkflowSideBar
      workflows={workflows}
      selectedId={selected?._id}
      onSelect={(workflow) => {
        show(workflow);
        setStepsOpen(false);
      }}
      onAdd={addStep}
    />
  );

  return (
    <div className="flex h-[calc(100dvh-3.5rem)] flex-col lg:h-dvh">
      <div className="flex flex-wrap items-center gap-2 border-b px-3 py-2.5 sm:px-4">
        {selected ? (
          <>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && rename()}
              disabled={!canEdit}
              aria-label="Workflow name"
              className="h-9 w-full font-semibold disabled:opacity-100 sm:w-56"
            />
            <Select value={version} onValueChange={(next) => show(selected, next)}>
              <SelectTrigger className="h-9 w-32" aria-label="Version">
                <SelectValue placeholder="No version" />
              </SelectTrigger>
              <SelectContent>
                {versions.map((v) => (
                  <SelectItem key={v.name} value={v.name}>
                    Version {v.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {!canEdit && (
              <p className="text-xs text-muted-foreground">by {selected.username}, read-only</p>
            )}
          </>
        ) : (
          <h1 className="text-lg font-bold">Workflows</h1>
        )}

        <div className="ml-auto flex gap-2">
          <Button variant="outline" className="lg:hidden" onClick={() => setStepsOpen(true)}>
            <Shapes />
            Steps
          </Button>
          {selected && canEdit && (
            <Button variant="outline" onClick={save}>
              <Save />
              Save
            </Button>
          )}
          {selected && (
            <Button onClick={runWorkflow} disabled={running}>
              {running ? <Loader2 className="animate-spin [animation-duration:0.6s]" /> : <Play />}
              Run
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" aria-label="More workflow actions">
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={createNew}>
                <Plus />
                New workflow
              </DropdownMenuItem>
              {selected && (
                <DropdownMenuItem onSelect={duplicate}>
                  <Copy />
                  Duplicate
                </DropdownMenuItem>
              )}
              {selected && canEdit && (
                <>
                  <DropdownMenuItem onSelect={saveAsNewVersion}>
                    <GitBranchPlus />
                    Save as new version
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {versions.length > 1 && (
                    <DropdownMenuItem
                      className="text-red-400 focus:text-red-400"
                      onSelect={() => setConfirming("version")}
                    >
                      <Trash2 />
                      Delete version {version}
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    className="text-red-400 focus:text-red-400"
                    onSelect={() => setConfirming("workflow")}
                  >
                    <Trash2 />
                    Delete workflow
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex min-h-0 flex-1">
        <aside className="hidden w-72 shrink-0 overflow-y-auto border-r lg:block">{sidebar}</aside>

        <div ref={canvas} className="flow relative min-w-0 flex-1 bg-well">
          {status === "ready" && !selected && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-well">
              <EmptyState title="No workflows yet">
                <p>A workflow runs programs one after another, passing files along.</p>
                <Button className="mt-5" onClick={createNew}>
                  <Plus />
                  New workflow
                </Button>
              </EmptyState>
            </div>
          )}
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
            fitView
            fitViewOptions={{ padding: 0.3, maxZoom: 1 }}
          >
            <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="hsl(226 22% 26%)" />
            <Controls showInteractive={false} />
            <MiniMap
              className="!hidden md:!block"
              pannable
              zoomable
              nodeColor="hsl(226 26% 30%)"
              maskColor="hsl(226 38% 9% / 0.7)"
            />
            {results && (
              <Panel
                position="top-right"
                className="w-[min(22rem,calc(100%-30px))] rounded-xl border bg-popover shadow-xl"
              >
                <div className="flex items-center justify-between border-b py-1.5 pl-4 pr-1.5">
                  <h2 className="text-sm font-semibold">{running ? "Running…" : "Last run"}</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    aria-label="Close run output"
                    onClick={() => setResults(null)}
                  >
                    <X />
                  </Button>
                </div>
                <ol className="max-h-64 space-y-3 overflow-y-auto p-4 text-sm" aria-live="polite">
                  {results.length === 0 && (
                    <li className="text-muted-foreground">
                      {running ? "Starting…" : "No program ran. Put one between Run and Finish."}
                    </li>
                  )}
                  {results.map((result, index) => (
                    <li key={index}>
                      <p className="font-medium">
                        <span className="mr-1.5 tabular-nums text-muted-foreground">{index + 1}.</span>
                        {result.label}
                      </p>
                      {result.error && (
                        <pre className="mt-1 whitespace-pre-wrap break-words font-mono text-xs text-red-400">
                          {result.error}
                        </pre>
                      )}
                      {result.text !== undefined && (
                        <pre className="mt-1 whitespace-pre-wrap break-words font-mono text-xs text-muted-foreground">
                          {result.text || "Printed nothing."}
                        </pre>
                      )}
                      {result.fileUrl && (
                        <Button asChild variant="outline" size="sm" className="mt-1.5">
                          <a href={result.fileUrl} download={result.fileName}>
                            <Download />
                            Download {result.fileName}
                          </a>
                        </Button>
                      )}
                    </li>
                  ))}
                </ol>
              </Panel>
            )}
          </ReactFlow>
        </div>
      </div>

      <Sheet open={stepsOpen} onOpenChange={setStepsOpen}>
        <SheetContent side="left" className="w-80 overflow-y-auto p-0 pt-8">
          <SheetTitle className="sr-only">Workflows and steps</SheetTitle>
          <SheetDescription className="sr-only">
            Pick a workflow, or tap a step to add it to the canvas.
          </SheetDescription>
          {sidebar}
        </SheetContent>
      </Sheet>

      <ConfirmDialog
        open={confirming === "workflow"}
        onOpenChange={(open) => !open && setConfirming(null)}
        title={`Delete ${selected?.name}?`}
        description="Every version of this workflow is removed. This can't be undone."
        confirmLabel="Delete workflow"
        onConfirm={remove}
      />
      <ConfirmDialog
        open={confirming === "version"}
        onOpenChange={(open) => !open && setConfirming(null)}
        title={`Delete version ${version}?`}
        description="The other versions stay. This can't be undone."
        confirmLabel="Delete version"
        onConfirm={removeVersion}
      />
    </div>
  );
};

export default () => (
  <ReactFlowProvider>
    <WorkflowEditor />
  </ReactFlowProvider>
);
