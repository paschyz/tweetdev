import React from "react";
import { Handle, NodeToolbar, Position, useReactFlow } from "reactflow";
import { Play, Trash2 } from "lucide-react";
import CustomButton from "../buttons/CustomButton";
import { FilePy } from "@phosphor-icons/react";
export default function RunNode({ id, data }) {
  const reactFlowInstance = useReactFlow();
  const runWorkflow = () => {
    alert("Running workflow");
  };
  const deleteNode = () => {
    reactFlowInstance.setNodes((nds) => nds.filter((node) => node.id !== id));
  };
  return (
    <>
      <NodeToolbar
        isVisible={data.forceToolbarVisible || undefined}
        position={data.toolbarPosition}
      >
        <div className="flex gap-2">
          {/* <button className="" onClick={runWorkflow}>
            <CustomButton
              text={"Run"}
              color={"#16a34a"}
              Icon={Play}
            ></CustomButton>
          </button> */}
          <button className="" onClick={deleteNode}>
            <CustomButton
              text={"Delete"}
              color={"#b91c1c"}
              Icon={Trash2}
            ></CustomButton>
          </button>
        </div>
      </NodeToolbar>
      <Handle type="source" position={Position.Right} />
      <div className="w-20 h-20 bg-componentBg border-2 border-componentBorder rounded-sm  ">
        <div className="flex justify-center items-center h-full">
          <p className="text-sm">
            <Play size={35} color="green"></Play>
          </p>
        </div>
        <div className="relative top-1">
          <p className="text-white text-[12px] text-center font-medium ">
            {data?.label}
          </p>
        </div>
      </div>
    </>
  );
}
