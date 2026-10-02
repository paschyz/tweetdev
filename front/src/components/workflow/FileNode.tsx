import React, { useEffect, useState } from "react";
import { Handle, NodeToolbar, Position, useReactFlow } from "reactflow";
import { Flag, Trash2 } from "lucide-react";
import CustomButton from "../buttons/CustomButton";
import { FilePy } from "@phosphor-icons/react";

export default function FileNode({ id, data }) {
  const reactFlowInstance = useReactFlow();
  const [filePreview, setFilePreview] = useState(null);



  const deleteNode = () => {
    reactFlowInstance.setNodes((nds) => nds.filter((node) => node.id !== id));
  };

  // Check the file type and set the appropriate preview
  useEffect(() => {
    if (data.fileData) {
      const fileType = data.fileData.type;

      // If it's an image, generate a preview URL
      if (fileType.startsWith("image/")) {
        const url = URL.createObjectURL(data.fileData);
        setFilePreview(<img src={url} alt="File Preview" className="w-20 h-20 object-contain" />);
      } 
      // If it's a text file, read and display the content
      else if (fileType === "text/plain") {
        const reader = new FileReader();
        reader.onload = (e) => setFilePreview(<p className="text-xs">{e.target.result}</p>);
        reader.readAsText(data.fileData);
      }
      // If it's a PDF or other file types, display a simple icon
      else {
        setFilePreview(
          <div className="flex flex-col justify-center items-center h-full">
            <FilePy size={35} />
            {/* <p className="text-white text-xs">File: {data.fileData.name}</p> */}
          </div>
        );
      }
    }
  }, [data.fileData]);

  return (
    <>
      <NodeToolbar
        isVisible={data.forceToolbarVisible || undefined}
        position={data.toolbarPosition}
      >
        <div className="flex gap-2">
          <button className="" onClick={deleteNode}>
            <CustomButton
              text={"Delete"}
              color={"#b91c1c"}
              Icon={Trash2}
            ></CustomButton>
          </button>
        </div>
      </NodeToolbar>
      <Handle type="target" position={Position.Left} />
      <div className="w-20 h-20 bg-componentBg border-2 border-componentBorder rounded-sm">
        <div className="flex justify-center items-center h-full">
          {filePreview ? (
            filePreview
          ) : (
            <p className="text-sm">
              <Flag size={35} color="#0062ff" />
            </p>
          )}
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
