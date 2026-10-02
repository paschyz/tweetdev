import { ApplePodcastsLogo, Users } from "@phosphor-icons/react";
import { Pencil, Plus, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import CustomButton from "./CustomButton";
import CustomButtonBig from "./CustomButtonBig";
import { createHub } from "../../api/hub";
import { getSession } from "../../services/sessionService";
import toast from "react-hot-toast";
import { fetchGetFollowUsers, updateUser } from "../../api/user";
import ModalFollowers from "../ModalFollowers";
import { navigateTo } from "../../utils/utils";

export default function ReadFollowsButton({
  followingCount,
  followersCount,
  followersText,
  username,
}) {
  const [isCreateHubModalOpen, setIsCreateHubModalOpen] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const toggleCreateHubModal = () => {
    setIsCreateHubModalOpen((prevState) => !prevState);
  };

  useEffect(() => {
    const fetchUsersRelated = async () => {
      const sessionToken = getSession();
      if (!sessionToken) {
        console.log("No session token found");
        return;
      }
      try {
        console.log("Fetching follow info for username:", username);
        const followInfo = await fetchGetFollowUsers(sessionToken, username);
        setFollowers(followInfo.followersUsers);
        setFollowing(followInfo.followingUsers);
        console.log("Fetched follow info:", followInfo);
      } catch (error) {
        console.error("Failed to fetch user profile picture:", error);
      }
    };

    fetchUsersRelated();
  }, [username]);

  return (
    <div>
      <div className="flex flex-row gap-3" onClick={toggleCreateHubModal}>
        <ModalFollowers
          followersCount={followingCount}
          followersText={"Following"}
        ></ModalFollowers>
        <ModalFollowers
          followersCount={followersCount}
          followersText={followersText}
        ></ModalFollowers>
      </div>

      {isCreateHubModalOpen && (
        <div className="fixed -top-36 inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={toggleCreateHubModal}
          ></div>

          {/* Modal */}
          <div className="bg-bodyBg p-4 rounded shadow-lg relative z-10 w-8/12  h-3/6">
            <div className="flex justify-end">
              <button
                className="text-secondaryColor font-medium text-sm"
                onClick={toggleCreateHubModal}
              >
                <X />
              </button>
            </div>
            <div className="p-2 -mt-5 flex flex-col gap-3">
              <div className="flex gap-3 items-center ml-[3px]">
                <ApplePodcastsLogo weight="bold" size={36} />
                <h2 className="text-lg font-semibold">Followers</h2>
              </div>
              <p className="text-secondaryColor">
                Explore your connections and discover your network!
              </p>
              <div className="grid grid-cols-2 mt-2">
                <div className="following ">
                  <p className="text-center font-medium text-secondaryColor">
                    Following{" "}
                  </p>
                  <div className="p-6 flex flex-col gap-4">
                    {following.map((user, key) => {
                      return (
                        <div
                          className="flex gap-3"
                          onClick={() =>
                            navigateTo(`/profile/${user.username}`)
                          }
                        >
                          <div
                            className="cursor-pointer bg-blue-700 w-10 h-10 rounded-full"
                            style={{
                              backgroundImage: `url(${user.profileImageUrl})`,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                            }}
                          ></div>
                          <div className="flex flex-col">
                            <div className="text-sm font-semibold leading-normal cursor-pointer">
                              {user.username}
                            </div>
                            <div className="inline mt-[-5px]">
                              <span className="text-[13px] font-medium text-gray-400">
                                {/* {user.joinDate} */}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="followers">
                  <p className="text-center font-medium text-secondaryColor">
                    Followers{" "}
                  </p>
                  <div className="p-6">
                    {followers.map((user, key) => {
                      return (
                        <div
                          className="flex gap-3"
                          onClick={() =>
                            navigateTo(`/profile/${user.username}`)
                          }
                        >
                          <div
                            className="cursor-pointer bg-blue-700 w-10 h-10 rounded-full"
                            style={{
                              backgroundImage: `url(${user.profileImageUrl})`,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                            }}
                          ></div>
                          <div className="flex flex-col">
                            <div className="text-sm font-semibold leading-normal cursor-pointer">
                              {user.username}
                            </div>
                            <div className="inline mt-[-5px]">
                              <span className="text-[13px] font-medium text-gray-400">
                                {/* {user.joinDate} */}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
