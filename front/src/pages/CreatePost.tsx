import React, { useEffect, useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import Button from "../components/buttons/CustomButton";
import { ThumbsUp } from "lucide-react";
import { createPost } from "../api/post";
import { getSession } from "../services/sessionService";
import toast from "react-hot-toast";
import HubSelect from "../components/HubSelect";
import { fetchUserHubs } from "../api/user";
import { IHub } from "../interfaces/IHub";
import { fetchPrograms } from "../api/programs";

export default function CreatePost() {
  const [value, setValue] = React.useState("**Hello world!!!**");
  const [userHubs, setUserHubs] = useState<IHub[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const sessionToken = getSession();
  const [selectedHubUsername, setSelectedHubUsername] = useState();
  const [selectedProgramName, setSelectedProgramName] = useState();
  const [selectedProgramID, setSelectedProgramID] = useState();
  const object = {
    content: value,
    hubname: selectedHubUsername,
    program: selectedProgramID,
  };
  const submitPost = () => {
    try {
      createPost(sessionToken, object);

      toast.success("Post created !", { duration: 1000 });
      window.location.href = "/";
    } catch (error) {
      toast.error("Error creation post !", { duration: 1000 });
    }
    setValue("**Hello world!!!**");
  };

  useEffect(() => {
    const fetchHubs = async () => {
      try {
        const sessionToken = getSession();
        const response = await fetchUserHubs(sessionToken);
        setUserHubs(response);
        console.log(response);
      } catch (error) {
        console.error("Error fetching hub info:", error);
      }
    };
    const fetchData = async () => {
      try {
        const sessionToken = getSession();
        const response = await fetchPrograms(sessionToken);
        setPrograms(response);
        console.log(response);
      } catch (error) {
        console.error("Error fetching programs info:", error);
      }
    };
    fetchData();
    fetchHubs();
  }, []);

  const handleHubSelect = (username: string) => {
    setSelectedHubUsername(username);
  };
  const handleProgramSelect = (name: string, id: string) => {
    setSelectedProgramName(name);
    setSelectedProgramID(id);
  };
  return (
    <div className="container pt-24 flex flex-col justify-center gap-7 px-12 w-11/12 max-w-none m-auto  ">
      {/* <div className="ml-auto relative group ">
        <div className="absolute w-64  bg-componentBg rounded-sm z-10 top-0 right-0 hidden group-hover:block mt-6  ">
          <div className="flex flex-col p-2 gap-2 ">
            {userHubs.length > 0 &&
              userHubs.map((hub, key) => {
                return (
                  <HubSelect
                    name={hub.name}
                    updateParentState={handleHubSelect}
                  />
                );
              })}
            {userHubs.length == 0 && <span>You are not subbed to any Hub</span>}
          </div>
        </div>
        <div className="flex flex-col">
          {selectedHubUsername && <span>{selectedHubUsername}</span>}
          {!selectedHubUsername && <span>No Hub Selected</span>}

          <span>Select Hub</span>
        </div>
      </div> */}
      <div className="flex flex-row justify-between">
        <details className="dropdown ">
          <summary className="btn px-2 min-h-0 h-6 ">
            {selectedProgramName}

            {!selectedProgramName && <span>No Program Selected</span>}
          </summary>
          <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
            {programs.map((program, key) => (
              <HubSelect
                name={program.name}
                id={program._id}
                updateParentState={handleProgramSelect}
              />
            ))}
          </ul>
        </details>
        <details className="dropdown ">
          <summary className="btn px-2 min-h-0 h-6 ">
            {selectedHubUsername}

            {!selectedHubUsername && <span>No Hub Selected</span>}
          </summary>
          <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
            {userHubs.map((hub, key) => (
              <HubSelect
                name={hub.name}
                updateParentState={handleHubSelect}
                id={undefined}
              />
            ))}
          </ul>
        </details>
      </div>
      <div>
        <h2 className="text-center text-xl font-bold">Create post</h2>
      </div>
      <div>
        <MDEditor value={value} onChange={setValue} />
      </div>
      <div className="bg-accentColor hover:bg-accentColorHover w-fit p-2 cursor-pointer rounded-lg ">
        <p className="text-sm font-semibold" onClick={() => submitPost()}>
          Submit
        </p>
      </div>
    </div>
  );
}
