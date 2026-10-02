import React, { useState, useEffect, useRef } from "react";
import { Handle, NodeToolbar, Position, useReactFlow } from "reactflow";
import { Code, Trash2, Pencil } from "lucide-react";
import CustomButton from "../buttons/CustomButton";
import { FilePy, FileTxt, FilePng, FileJpg,FileJs } from "@phosphor-icons/react";
import { navigateTo, navigateToNewWindow } from "../../utils/utils";
import { SiJavascript,SiPython } from "react-icons/si";

export default function CodeNode({ id, data }) {
  const reactFlowInstance = useReactFlow();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef(null);

  const deleteNode = () => {
    reactFlowInstance.setNodes((nds) => nds.filter((node) => node.id !== id));
  };

  const getIconByFileType = (fileType: string) => {
    switch (fileType) {
      case "py":
        return <FilePy size={16} weight="fill" />;
      case "txt":
        return <FileTxt size={16} weight="fill" />;
      case "png":
        return <FilePng size={16} weight="fill" />;
      case "jpg":
        return <FileJpg size={16} weight="fill" />;
      case "js":
        return <FileJs size={16} weight="fill" />;
      default:
        return <div> </div>; // ou une icône par défaut si tu préfères
    }
  };
  const toggleModal = () => {
    setIsModalOpen((prevState) => !prevState);
  };

  // Close modal if clicked outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsModalOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const codeData = data.codeData;

  return (
    <>
      <NodeToolbar
        isVisible={data.forceToolbarVisible || undefined}
        position={data.toolbarPosition}
        className="flex gap-1"
      >
        <button>
          <div onClick={() => navigateToNewWindow("/program/" + codeData._id)}>
            <CustomButton text={"View"} color={"#355cc9"} Icon={Pencil} />
          </div>
        </button>
        <button className="flex gap-1" onClick={deleteNode}>
          <CustomButton text={"Delete"} color={"#b91c1c"} Icon={Trash2} />
        </button>
      </NodeToolbar>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
      <div className="w-20 h-20 bg-componentBg border-2 border-componentBorder rounded-sm">
        <div className="flex justify-center items-center h-full">
          <p className="text-sm">
            {codeData.language === "python" ? (
  <SiPython size={30} fill="#3399ff" />
) : codeData.language === "javascript" ? (
  <SiJavascript size={30} fill="yellow" />
) : <Code size={35} color="orange" />}
          </p>
        </div>
        <div className="flex flex-row justify-between mx-1">
        <div className="relative -top-[27px]">
          {getIconByFileType(codeData.inputFileType) }
        </div>
        <div className="relative -top-[27px]">
          {getIconByFileType(codeData.outputFileType) }
        </div>
        </div>
        <div className="relative -top-5">
          <p className="text-white text-[12px] text-center font-medium">
            {data?.label}
          </p>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center w-screen">
          <div
            ref={modalRef}
            className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full"
          >
            <h2 className="text-lg font-semibold mb-4">Edit Code Data</h2>
            <p>{codeData.name}</p>

            {/* You can add more content here */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
