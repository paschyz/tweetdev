import React, { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { deleteWorkflow, getIsWorkflowDeletable } from "@/api/workflow";
import { DeleteMenu } from "@/components/DeleteMenu";
import { FeedItem, ItemHeader } from "@/components/FeedItem";
import LikeButton from "@/components/LikeButton";
import { LanguageTag, STEPS } from "@/components/workflow/nodes";
import { cn } from "@/lib/utils";
import { getSession } from "@/services/sessionService";

/** The steps of a saved flow in running order: start at Run, follow the edges. */
const stepsInOrder = (flow: any) => {
  const nodes: any[] = flow?.nodes ?? [];
  const edges: any[] = flow?.edges ?? [];
  const ordered = [];
  const seen = new Set();
  let current = nodes.find((node) => node.type === "run-node") ?? nodes[0];
  while (current && !seen.has(current.id)) {
    seen.add(current.id);
    ordered.push(current);
    const edge = edges.find((e) => e.source === current.id);
    current = edge && nodes.find((node) => node.id === edge.target);
  }
  return ordered;
};

/** A workflow drawn as the chain it runs: Run › Upload › resize.py › Finish */
export function PipelineStrip({ flow }: { flow: any }) {
  const steps = stepsInOrder(flow);
  if (steps.length === 0) {
    return <p className="text-sm text-muted-foreground">No steps yet.</p>;
  }
  return (
    <ol className="flex flex-wrap items-center gap-y-2">
      {steps.map((step, index) => {
        const builtIn = STEPS[step.type as keyof typeof STEPS];
        return (
          <li key={step.id} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="mx-1 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
            )}
            <span className="inline-flex max-w-48 items-center gap-2 rounded-lg border bg-card px-2.5 py-1.5 text-sm font-medium">
              {builtIn ? (
                <builtIn.icon className={cn("h-3.5 w-3.5 shrink-0", builtIn.tone)} />
              ) : (
                <LanguageTag language={step.data?.codeData?.language} />
              )}
              <span className="truncate">{step.data?.label}</span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}

export default function Workflow({
  programInfo,
  onDeleted,
}: {
  programInfo: any;
  onDeleted?: (id: string) => void;
}) {
  const [deletable, setDeletable] = useState(false);
  const latest = programInfo.versions?.[programInfo.versions.length - 1];

  useEffect(() => {
    getIsWorkflowDeletable(getSession(), programInfo._id)
      .then((can) => setDeletable(!!can))
      .catch(() => {});
  }, [programInfo._id]);

  const remove = async () => {
    try {
      await deleteWorkflow(getSession(), programInfo._id);
      toast.success("Workflow deleted");
      onDeleted?.(programInfo._id);
    } catch {
      toast.error("Couldn't delete the workflow. Try again.");
    }
  };

  return (
    <FeedItem to={"/workflow/" + programInfo._id}>
      <ItemHeader
        username={programInfo.username}
        date={programInfo.creationDate}
        menu={deletable && <DeleteMenu what="workflow" onDelete={remove} />}
      />
      <div className="mt-3 sm:pl-[52px]">
        <h2 className="mb-3 font-semibold">
          {programInfo.name}
          {latest && (
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              version {latest.name}
            </span>
          )}
        </h2>
        <PipelineStrip flow={latest?.content} />
        <div className="mt-4">
          <LikeButton item={programInfo} />
        </div>
      </div>
    </FeedItem>
  );
}
