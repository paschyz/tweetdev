import React, { useEffect, useState, useCallback } from "react";
import "../styles/Feed.css";
import { getSession } from "../services/sessionService";
import { fetchPosts } from "../api/post";
import { IPost } from "../interfaces";
import Post from "../components/Post";
import Favorites from "../components/Favorites";
import { fetchPrograms } from "../api/programs";
import Workflow from "../components/Workflow";
import { fetchWorkflows } from "../api/workflow";
import Program from "../components/program/Program";
import { IHub } from "../interfaces/IHub";
import { fetchHubs } from "../api/hub";
import FeaturedHubItem from "../components/FeaturedHubItem";

const Feed = () => {
  const [portals, setPortals] = useState<IHub[]>([]);
  const [posts, setPosts] = useState<IPost[]>([]);
  const [programs, setPrograms] = useState<IProgram[]>([]);
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [selectedMode, setSelectedMode] = useState("posts");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sessionToken = getSession();
        if (sessionToken) {
          const postsData = await fetchPosts(sessionToken, true);
          setPosts(postsData);
          const programsData = await fetchPrograms(sessionToken);
          setPrograms(programsData);
          const workflowsData = await fetchWorkflows(sessionToken);
          setWorkflows(workflowsData);
        }
      } catch (error) {
        console.error(`Error fetching ${selectedMode}:`, error);
      }
    };

    const fetchHubsData = async () => {
      try {
        const sessionToken = getSession();
        if (sessionToken) {
          const hubsData = await fetchHubs(sessionToken);
          setPortals(hubsData);
        } else {
          console.error("Error fetching posts");
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchHubsData();
    fetchData();
  }, [selectedMode]);

  const handleModeChange = useCallback((mode: React.SetStateAction<string>) => {
    setSelectedMode(mode);
  }, []);

  return (
    <div className="feed-container grid grid-cols-[1fr_800px_1.2fr] gap-4 p-12 mt-6">
      <div className="hidden sm:block">
        <Favorites />
      </div>

      <div className="flex flex-col gap-4 col-span-2 sm:col-span-2 lg:col-span-1">
        <div className="flex gap-4 mb-4 flex-row font-medium">
          <button
            className={`py-2 px-4 rounded-md ${
              selectedMode === "posts"
                ? "bg-accentColor text-white"
                : "bg-gray-200 text-gray-800"
            } hover:bg-accentColorHover`}
            onClick={() => handleModeChange("posts")}
          >
            Posts
          </button>
          <button
            className={`py-2 px-4 rounded-md ${
              selectedMode === "programs"
                ? "bg-accentColor text-white"
                : "bg-gray-200 text-gray-800"
            } hover:bg-accentColorHover`}
            onClick={() => handleModeChange("programs")}
          >
            Programs
          </button>
          <button
            className={`py-2 px-4 rounded-md ${
              selectedMode === "workflows"
                ? "bg-accentColor text-white"
                : "bg-gray-200 text-gray-800"
            } hover:bg-accentColorHover`}
            onClick={() => handleModeChange("workflows")}
          >
            Workflows
          </button>
        </div>
        {selectedMode === "posts" &&
          posts.map((post, index) => <Post postInfo={post} key={index} />)}
        {selectedMode === "programs" &&
          programs.map((program, index) => (
            <Program programInfo={program} key={index} />
          ))}
        {selectedMode === "workflows" &&
          workflows.map((workflow, index) => (
            <Workflow programInfo={workflow} key={index} />
          ))}
      </div>

      <div className="hidden lg:block">
        <div className="pt-4 px-6 text-lg font-medium flex flex-col gap-3 shrink-0">
          Featured Hubs
          {portals.map((hub, index) => (
            <FeaturedHubItem hub={hub} key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Feed;
