import { Flag, Play, Upload } from "lucide-react";
import React, { useEffect, useState } from "react";
import { getSession } from "../../services/sessionService";
import { fetchPrograms } from "../../api/programs";
import { convertTimeToPostTime } from "../../utils/utils";
import { fetchWorkflows } from "../../api/workflow";

function WorkflowSideBar({ workflows, selectedKey, selectWorkflow }) {
  // const programs: IProgram[] = [
  //   {
  //     id: "1",
  //     name: "first",
  //     creationDate: "2023-01-01",
  //     content: "First program content",
  //     authorName: "paschyz",
  //     inputFileType: "png",
  //     outputFileType: "png",
  //   },
  //   {
  //     id: "2",
  //     name: "second",
  //     creationDate: "2023-02-01",
  //     content: "Second program content",
  //     authorName: "johnDoe",
  //     inputFileType: "jpg",
  //     outputFileType: "jpg",
  //   },
  //   {
  //     id: "3",
  //     name: "third",
  //     creationDate: "2023-03-01",
  //     content: "Third program content",
  //     authorName: "janeSmith",
  //     inputFileType: "gif",
  //     outputFileType: "gif",
  //   },
  //   {
  //     id: "4",
  //     name: "fourth",
  //     creationDate: "2023-04-01",
  //     content: "Fourth program content",
  //     authorName: "aliceJones",
  //     inputFileType: "bmp",
  //     outputFileType: "bmp",
  //   },
  //   {
  //     id: "5",
  //     name: "fifth",
  //     creationDate: "2023-05-01",
  //     content: "Fifth program content",
  //     authorName: "bobBrown",
  //     inputFileType: "tiff",
  //     outputFileType: "tiff",
  //   },
  // ];
  const [programs, setPrograms] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sessionToken = getSession();

        if (sessionToken) {
          const programsData = await fetchPrograms(sessionToken);
          setPrograms(programsData);
        } else {
          console.error("Error fetching programs");
        }
      } catch (error) {
        console.error("Error fetching programs:", error);
      }
    };

    fetchData();
  }, []);
  const onDragStart = (event, nodeName, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);

    event.dataTransfer.setData("application/reactflow/node/name", nodeName);
    event.dataTransfer.effectAllowed = "move";
  };

  const onDragStartCode = (event, nodeName, nodeType, codeData) => {
    event.dataTransfer.setData("application/reactflow", nodeType);

    event.dataTransfer.setData("application/reactflow/node/name", nodeName);
    event.dataTransfer.setData(
      "application/reactflow/codeData",
      JSON.stringify(codeData)
    );
    event.dataTransfer.effectAllowed = "move";
  };
  return (
    <div
      style={{ width: "20vw" }}
      className="border-2 rounded-lg border-componentBorder bg-componentBg p-4 flex flex-col gap-4 max-h-[89vh] overflow-auto"
    >
      {workflows.length > 0 && (
        <h1 className="text-lg font-semibold">Workflows</h1>
      )}

      {workflows.map((workflow, key) => (
        <div
          key={key}
          onClick={(e) => selectWorkflow(workflow, key)}
          className={`flex flex-col gap-4 col-span-2 sm:col-span-2 lg:col-span-1 border-2 rounded-md p-2 cursor-pointer hover:bg-componentBgHover ${
            selectedKey === key ? "border-blue-500" : "border-componentBorder"
          }`}
        >
          <h1 className="font-medium">{workflow.name}</h1>
          <div className="flex flex-row gap-1">
            <div className="text-secondaryColor">by</div>{" "}
            <div className="font-medium text-secondaryColor">
              {workflow.username}
            </div>
          </div>
          {/* <h3>{workflow.username}</h3> */}
        </div>
      ))}
      <h1 className="text-lg font-semibold">Nodes</h1>
      <div
        className="border-2 rounded-md border-componentBorder p-2 cursor-pointer hover:bg-componentBgHover select-none flex items-center gap-2"
        onDragStart={(event) => onDragStart(event, "Run", "run-node")}
        draggable
      >
        <Play size={35} color="green"></Play>
        <p className="font-medium">Run Node</p>
      </div>
      <div
        className="border-2 rounded-md border-componentBorder p-2 cursor-pointer hover:bg-componentBgHover select-none flex items-center gap-2"
        onDragStart={(event) => onDragStart(event, "Finish", "finish-node")}
        draggable
      >
        <Flag size={35} color="#0062ff"></Flag>

        <p className="font-medium">Finish Node</p>
      </div>
      <div
        className="border-2 rounded-md border-componentBorder p-2 cursor-pointer hover:bg-componentBgHover select-none flex items-center gap-2"
        onDragStart={(event) => onDragStart(event, "Upload", "upload-node")}
        draggable
      >
        <Upload size={35} color="#7a4eea"></Upload>

        <p className="font-medium">Upload Node</p>
      </div>
      <h1 className="text-lg font-semibold">Programs</h1>
      {programs.map((program, key) => {
        return (
          <div
            className="border-2 rounded-md border-componentBorder p-[13px] cursor-pointer hover:bg-componentBgHover select-none"
            onDragStart={(event) =>
              onDragStartCode(event, program.name, "code-node", program)
            }
            draggable
          >
            <div className="flex items-center justify-between ">
              <div className="flex gap-1 items-center">
                {/* <div
                  className="cursor-pointer bg-green-700 w-6 h-6 rounded-full"
                  // onClick={(e) =>
                  //   handleChildClick(e, `/hub/${postInfo.hubname}`)
                  // }
                  style={{
                    backgroundImage: `url("sqdqs")`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                ></div> */}

                <div className="text-base font-medium ">{program.username}</div>
              </div>
              <div className="text-sm text-secondaryColor font-medium">
                {convertTimeToPostTime(program.creationDate)}
              </div>
            </div>
            <h2 className="text-lg font-semibold text-center break-words whitespace-normal py-6">
              {" "}
              {program.name}
            </h2>
            <div className=" flex justify-between">
              <div className="text-sm text-secondaryColor font-medium">
                {program.inputFileType}
              </div>
              <div className="text-sm text-secondaryColor font-medium">
                {program.outputFileType}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default WorkflowSideBar;
