import React, { useRef, useState, useEffect } from "react";
import { Handle, NodeToolbar, Position, useReactFlow } from "reactflow";
import { Trash2, Upload, FileCheck2, Download } from "lucide-react";
import CustomButton from "../buttons/CustomButton";
import toast from "react-hot-toast";

const UploadNode = ({ id, data }) => {
  const reactFlowInstance = useReactFlow();
  const nodeRef = useRef(null);
  const [file, setFile] = useState<any>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const fileInputRef = useRef(null);

  const deleteNode = () => {
    reactFlowInstance.setNodes((nds) => nds.filter((node) => node.id !== id));
  };

  const handleFileInputChange = (e) => {
    const files = Array.from(e.target.files);
    setFile(files);

    if (files.length != 0) {
      // Save the file in the node's data property
      reactFlowInstance.setNodes((nds) =>
        nds.map((node) =>
          node.id === id
            ? {
                ...node,
                data: {
                  ...node.data,
                  file: files[0], // Store the first file or handle multiple if needed
                },
              }
            : node
        )
      );

      setFileUrl(URL.createObjectURL(files[0])); // Create a downloadable URL
      
      toast.success(`Uploaded file ${files[0].name}`);
    }
  };

  const openFilePicker = () => {
    fileInputRef.current.click();
  };

  useEffect(() => {
    // Cleanup URL object when the component unmounts or file changes
    return () => {
      if (fileUrl) {
        URL.revokeObjectURL(fileUrl);
      }
    };
  }, [fileUrl]);

  return (
    <>
      <NodeToolbar
        isVisible={data.forceToolbarVisible || undefined}
        position={data.toolbarPosition}
      >
        <div className="flex gap-2">
          <button className="" onClick={openFilePicker}>
            <CustomButton
              text={"Upload"}
              color={"#7a4eea"}
              Icon={Upload}
            ></CustomButton>
          </button>
          {fileUrl && (
            <button className="" onClick={() => window.open(fileUrl, '_blank')}>
              <CustomButton
                text={"Download"}
                color={"#4CAF50"} // You can change the color to green or any color you'd like
                Icon={Download}
              ></CustomButton>
            </button>
          )}
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
      <Handle type="source" position={Position.Right} />
      <div
        ref={nodeRef}
        className="w-20 h-20 bg-componentBg border-2 border-componentBorder rounded-sm"
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileInputChange}
          multiple
        />
        <div className="flex justify-center items-center h-full ">
          <Upload size={35} color="#7a4eea" />
        </div>
        {file != null && (
          <div>
            <div className="relative -top-[27px] right-[2px] text-right ">
              <FileCheck2 size={14} />
            </div>
            <div className="relative -top-5">
              <p className="text-white text-[12px] text-center font-medium ">
                {data?.label}
              </p>
            </div>
          </div>
        )}
        {file == null && (
          <div className="relative top-1">
            <p className="text-white text-[12px] text-center font-medium ">
              {data?.label}
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default UploadNode;
