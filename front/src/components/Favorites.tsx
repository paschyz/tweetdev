import React, { useEffect, useState } from "react";
import Portal from "../interfaces/Portal";
import FavoritesPortalItem from "./FavoritesPortalItem";
import { ApplePodcastsLogo, Users } from "@phosphor-icons/react";
import { PortalSample } from "../interfaces/PortalSample";
import { IHub } from "../interfaces/IHub";
import { getSession } from "../services/sessionService";
import { fetchGetFollowing, fetchUserHubs } from "../api/user";
import { Plus } from "lucide-react";
import CreateHubButton from "./buttons/CreateHubButton";
function Favorites(props) {
  const [portals, setPortals] = useState<Portal[]>(PortalSample);
  const [hubs, setHubs] = useState<IHub[]>([]);
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [isCreateHubDropdownOpen, setIsCreateHubDropdownOpen] = useState(false);

  const toggleCreateHubDropdown = () => {
    setIsCreateHubDropdownOpen((prevState) => !prevState);
  };
  useEffect(() => {
    const sessionToken = getSession();
    const fetchData = async () => {
      try {
        if (sessionToken) {
          const userHubs = await fetchUserHubs(sessionToken);
          setHubs(userHubs);
          const userFollowing = await fetchGetFollowing(sessionToken);
          setUsers(userFollowing);
        }
      } catch (error) {
        console.error("error while fetching user hubs", error);
      }
    };
    fetchData();
  }, []);
  return (
    <div className="flex flex-col gap-6  h-[700px] pt-4 px-6 overflow-auto bg-componentBg border-2 border-componentBorder rounded-xl ">
      <h1 className="text-lg font-medium">Followed</h1>
      <div className="ml-1 ">
        <h2 className="text-base font-medium text-secondaryColor flex gap-2 mb-5">
          {" "}
          <ApplePodcastsLogo
            weight="bold"
            size={23}
            color="#C7C9CE"
          ></ApplePodcastsLogo>{" "}
          Hubs
        </h2>
        <div className="flex flex-col gap-2 mt-3 ">
          <CreateHubButton></CreateHubButton>
          {hubs.map((hub, index) => (
            <FavoritesPortalItem source={hub} type={"hub"} key={index} />
          ))}
        </div>
      </div>
      <div className="ml-1 ">
        <h2 className="text-base font-medium text-secondaryColor flex gap-2 mb-5">
          <Users size={23} weight="bold" color="#C7C9CE"></Users> People
        </h2>
        <div className="flex flex-col gap-2 mt-3 ">
          {users.map((user, index) => (
            <FavoritesPortalItem source={user} type={"user"} key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Favorites;
