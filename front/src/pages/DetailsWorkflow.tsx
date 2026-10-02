import React, { useRef, useCallback, useState, useEffect } from "react";
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  useReactFlow,
  MiniMap,
  Background,
  Panel,
} from "reactflow";
import "reactflow/dist/style.css";
import { Play, Save, Trash2 } from "lucide-react";
import WorkflowSideBar from "../components/workflow/WorkflowSideBar";
import CodeNode from "../components/workflow/CodeNode";
import toast from "react-hot-toast";
import CustomButton from "../components/buttons/CustomButton";
import RunNode from "../components/workflow/RunNode";
import FinishNode from "../components/workflow/FinishNode";
import UploadNode from "../components/workflow/UploadNode";
import { getSession } from "../services/sessionService";
import {
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
import { useParams } from "react-router-dom";
const initialNodes = [
  {
    id: "1",
    type: "run-node",
    data: { label: "Run" },
    position: { x: 0, y: 0 },
  },
  {
    id: "2",
    type: "upload-node",
    data: { label: "Upload" },
    position: { x: 200, y: 0 },
  },
  {
    id: "3",
    type: "code-node",
    data: { label: "Code" },
    position: { x: 400, y: 0 },
  },
  {
    id: "4",
    type: "finish-node",
    data: { label: "Finish" },
    position: { x: 600, y: 0 },
  },
];

const nodeTypes = {
  "code-node": CodeNode,
  "run-node": RunNode,
  "finish-node": FinishNode,
  "upload-node": UploadNode,
};

let id = 0;
const getId = () => `dndnode_${id++}`;

const DetailsWorkflow = () => {
  const { id } = useParams<{ id: string }>();
  const [isModifiable, setIsModifiable] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState("");
  const [versions, setVersions] = useState([]);
  const [token, setToken] = useState("");
  const [notFoundWorkflow, setNotFoundWorkflow] = useState(false);
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { screenToFlowPosition } = useReactFlow();
  const [rfInstance, setRfInstance] = useState<typeof ReactFlow | null>(null);
  const [selectedWorkflow, setSelectedWorkflow] = useState<
    IWorkflow | undefined
  >();

  const [workflowName, setWorkflowName] = useState(
    (selectedWorkflow && selectedWorkflow.name) || "Untitled Workflow"
  );
  const [selectedKey, setSelectedKey] = useState(0);
  const [workflow, setWorkflow] = useState();
  const [workflows, setWorkflows] = useState<any[]>([]);
  const handleChange = (e) => {
    setWorkflowName(e.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sessionToken = getSession();
        if (!sessionToken) {
          console.error("No session token found");
          return;
        }
        setToken(sessionToken);

        if (id) {
          const workflowData = await fetchWorkflowById(sessionToken, id);
          if (workflowData) {
            selectWorkflow(workflowData);
            // setLoading(false);

            const response = await getIsWorkflowDeletable(sessionToken, id);
            setIsModifiable(response);
          } else {
            setNotFoundWorkflow(true);
            // setLoading(false);
          }
        }
      } catch (error) {
        setNotFoundWorkflow(true);
        // setLoading(false);
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      const updatedWorkflows = workflows.map((workflow, index) => {
        if (index === selectedKey) {
          return { ...workflow, name: workflowName };
        }
        return workflow;
      });
      setWorkflows(updatedWorkflows);
      onSaveName();
    }
  };

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow");
      const nodeName = event.dataTransfer.getData(
        "application/reactflow/node/name"
      );

      if (typeof type === "undefined" || !type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: `${nodeName}` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition]
  );
  const onConnect = useCallback(
    (params) => {
      const { source, target } = params;

      const targetHasInput = edges.some((edge) => edge.target === target);

      const sourceHasOutput = edges.some((edge) => edge.source === source);

      if (!targetHasInput && !sourceHasOutput) {
        setEdges((eds) => addEdge(params, eds));
      } else {
        toast.error("Nodes can only have one input and one output.");
      }
    },
    [edges, setEdges]
  );
  const onSave = async () => {
    if (rfInstance) {
      const flow = rfInstance.toObject();
      const content = { content: flow };
      try {
        const sessionToken = getSession();
        const update = await updateWorkflow(
          sessionToken,
          selectedWorkflow?._id ?? "",
          content
        );
        onSaveName();
        toast.success("workflow updated successfully");
        window.location.href = "";
      } catch (error) {
        toast.error("error while updating workflow");
      }
      toast.success(`${workflowName} updated successfully`);
    }
  };
  const onSaveName = async () => {
    const content = { name: workflowName };
    try {
      const sessionToken = getSession();
      const update = await updateWorkflowName(
        sessionToken,
        selectedWorkflow?._id ?? "",
        content
      );
    } catch (error) {
      toast.error("error while updating workflow");
    }
    toast.success(`${workflowName} updated`);
  };

  const onSaveUpgrade = async () => {
    if (rfInstance) {
      const flow = rfInstance.toObject();
      const content = { content: flow };
      try {
        const sessionToken = getSession();
        const upgrade = await upgradeWorkflow(
          sessionToken,
          selectedWorkflow?._id ?? "",
          content
        );
        onSaveName();
        toast.success("workflow upgraded successfully");
        window.location.href = "";
      } catch (error) {
        toast.error("error while upgrading workflow");
      }
      toast.success(`${workflowName} upgraded successfully`);
    }
  };
  const runWorkflow = () => {
    const startNode = nodes.find((node) => node.type === "run-node");
    const endNode = nodes.find((node) => node.type === "finish-node");

    if (!startNode || !endNode) {
      toast.error("Workflow must have a start and finish node.");
      return;
    }

    const nodeNames = [];
    let currentNode = startNode;

    while (currentNode) {
      nodeNames.push(currentNode.data.label);
      const nextEdge = edges.find((edge) => edge.source === currentNode.id);
      if (!nextEdge) break;
      currentNode = nodes.find((node) => node.id === nextEdge.target);
      if (currentNode && currentNode.type === "finish-node") {
        nodeNames.push(currentNode.data.label);
        break;
      }
    }

    if (currentNode && currentNode.type === "finish-node") {
      toast.success(`Workflow: ${nodeNames.join(" -> ")}`);
    } else {
      toast.error("Workflow does not end with a finish node.");
    }
  };
  const selectWorkflow = (workflow) => {
    setSelectedWorkflow(workflow);
    console.log(workflow);
    setWorkflowName(workflow.name);
    restoreFlow(workflow.versions[workflow.versions.length - 1].content);
    setSelectedVersion(workflow.versions[workflow.versions.length - 1].name);
    setVersions(workflow.versions);
  };

  const selectVersion = (e, version) => {
    setSelectedVersion(version.name);
    console.log(version.content);
    restoreFlow(version.content);
  };

  const restoreFlow = async (flow: any) => {
    if (flow) {
      setNodes(flow.nodes || []);
      setEdges(flow.edges || []);
    }
  };
  const deleteVersion = async (versionName: any) => {
    try {
      const sessionToken = getSession();
      const update = await deleteWorkflowVersionByIdandName(
        sessionToken,
        selectedWorkflow?._id ?? "",
        versionName
      );
      toast.success("version deleted successfully");
      window.location.href = "";
    } catch (error) {
      toast.error("error while updating workflow");
    }
  };

  const deleteWorkflowByID = async () => {
    try {
      const sessionToken = getSession();
      const update = await deleteWorkflow(
        sessionToken,
        selectedWorkflow?._id ?? ""
      );
      toast.success("workflow deleted successfully");
      window.location.href = "/";
    } catch (error) {
      toast.error("error while deleting workflow");
    }
  };

  const createWorkflows = async () => {
    if (rfInstance) {
      const flow = rfInstance.toObject();
      const content = { name: "Untitled Workflow", content: flow };
      try {
        const sessionToken = getSession();
        const create = await createWorkflow(sessionToken, content);
        toast.success("workflow created successfully");
        window.location.href = "";
      } catch (error) {
        toast.error("error while creating workflow");
      }
    }
  };

  const initializeNodes = () => {
    setNodes(initialNodes);
  };
  if (notFoundWorkflow) {
    return (
      <div className="mt-20 mx-6">
        <div className="flex justify-center mb-6">
          <p>Workflow not found or ID not recognized.</p>
        </div>
      </div>
    );
  }
  return (
    <div className="mt-20 mx-4">
      <div className="flex mb-2 gap-2">
        <input
          className="font-medium rounded px-2 outline-none "
          type="text"
          value={workflowName}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        <details className="dropdown ">
          <summary className="btn px-2 min-h-0 h-6 ">{selectedVersion}</summary>
          <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
            {versions.map((version) => (
              <li className="flex flex-row " key={version.name}>
                <a
                  className="flex-1"
                  onClick={(e) => selectVersion(e, version)}
                >
                  Version {version.name}
                </a>
                <div
                  className="flex items-center justify-center"
                  onClick={() => deleteVersion({ versionName: version.name })}
                >
                  <Trash2 color="white" size={16}></Trash2>
                </div>
              </li>
            ))}
          </ul>
        </details>
        <h1 className="flex-1 text-center font-medium">Details Workflow</h1>
      </div>

      <div className="flex gap-2">
        <WorkflowSideBar
          workflows={[]}
          selectedKey={selectedKey}
          selectWorkflow={selectWorkflow}
        />
        <div
          className="border-2 rounded-lg border-componentBorder bg-componentBg"
          style={{ width: "80vw", height: "89vh" }}
          ref={reactFlowWrapper}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDrop={onDrop}
            onInit={setRfInstance}
            onDragOver={onDragOver}
            fitView
          >
            <MiniMap />
            <Panel className="flex gap-1" position="bottom-center">
              <div onClick={runWorkflow}>
                <CustomButton
                  color={"#355cc9"}
                  Icon={Play}
                  text={"Run Workflow"}
                />
              </div>
              <div onClick={onSave}>
                <CustomButton
                  color={"#22c55e "}
                  Icon={Save}
                  text={"Save"}
                ></CustomButton>
              </div>
              <div onClick={onSaveUpgrade}>
                <CustomButton
                  color={"#22c55e "}
                  Icon={Save}
                  text={"Upgrade Version"}
                ></CustomButton>
              </div>
              <div onClick={deleteWorkflowByID}>
                <CustomButton
                  color={"#b91c1c"}
                  Icon={Trash2}
                  text={"Delete"}
                ></CustomButton>
              </div>
            </Panel>
            <Controls />
            <Background variant="dots" gap={16} size={1} />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
};

export default () => (
  <ReactFlowProvider>
    <DetailsWorkflow />
  </ReactFlowProvider>
);
