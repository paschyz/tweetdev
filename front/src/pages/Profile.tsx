import React, { useEffect, useState } from "react";
import {
  deleteSelf,
  fetchSelfInfo,
  fetchUserInfoByUsername,
} from "../api/user";
import {
  getLocalStorageItemByName,
  getSession,
} from "../services/sessionService";
import { convertTimestampToMonthYear, defaultUser } from "../utils/utils";
import "../styles/Profile.css";
import { fetchProfilePosts } from "../api/post";
import { IPost } from "../interfaces";
import { useParams } from "react-router-dom";
import Favorites from "../components/Favorites";
import {
  Clock,
  PencilSimple,
  DotsThreeVertical,
  InstagramLogo,
  YoutubeLogo,
  XLogo,
  TwitterLogo,
  TwitchLogo,
  DiscordLogo,
  GithubLogo,
  PatreonLogo,
} from "@phosphor-icons/react";
import EditButton from "../components/buttons/EditButton";
import ModalFollowers from "../components/ModalFollowers";
import Post from "../components/Post";
import EditProfileButton from "../components/buttons/EditProfileButton";
import EditHubButton from "../components/buttons/EditHubButton";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../provider/AuthProvider";
import ReadFollowsButton from "../components/buttons/ReadFollowsButton";
import EditPasswordButton from "../components/buttons/EditPasswordButton";
import Workflow from "../components/Workflow";
import { fetchGetUserPrograms, fetchPrograms } from "../api/programs";
import { fetchGetUserWorkflows, fetchWorkflows } from "../api/workflow";
import Program from "../components/program/Program";
import FollowButton from "../components/buttons/FollowButton";

function Profile() {
  const [userInfo, setUserInfo] = useState<UserResponse>(defaultUser);
  const [posts, setPosts] = useState<IPost[]>([]);
  const [programs, setPrograms] = useState([]);
  const [workflows, setWorkflows] = useState([]);
  const [selectedMode, setSelectedMode] = useState("posts"); // Default mode
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [followersText, setFollowersText] = useState("Follower");
  const { logoutAndClearToken } = useAuth();
  const sessionToken = getSession();
  const [notFoundUser, setNotFoundUser] = useState("");
  let { username } = useParams();
  const [sessionUsername, setSessionUsername] = useState("");

  const deleteUser = () => {
    try {
      deleteSelf(sessionToken);
      toast.success("Deleted User !");
      logoutAndClearToken();
      window.location.href = "/login";
    } catch (error) {
      toast.error("Error Deleting User");
    }
  };

  useEffect(() => {
    const getSessionUsername = getLocalStorageItemByName("username");
    setSessionUsername(getSessionUsername);
    const fetchData = async () => {
      try {
        if (sessionToken) {
          if (username == undefined) {
            const selfInfoData = await fetchSelfInfo(sessionToken);
            setUserInfo(selfInfoData);
            setFollowersCount(selfInfoData.followers.length);
            setFollowingCount(selfInfoData.following.length);
            const selfPostsData = await fetchProfilePosts(sessionToken);
            setPosts(selfPostsData);
          } else {
            try {
              const userInfoData = await fetchUserInfoByUsername(
                sessionToken,
                username
              );
              setUserInfo(userInfoData);
              setFollowersCount(userInfoData.followers.length);
              setFollowingCount(userInfoData.following.length);
              const selfPostsData = await fetchProfilePosts(
                sessionToken,
                userInfoData.username
              );
              setPosts(selfPostsData);
            } catch (error) {
              setNotFoundUser("This account doesn’t exist");
              console.error("Error fetching user info:", error);
            }
          }
        } else {
          console.error("Token de session null.");
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };
    fetchData();
  }, [sessionToken, username]);

  useEffect(() => {
    setFollowersText(followersCount > 1 ? "Followers" : "Follower");
  }, [followersCount]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        if (sessionToken) {
          const selfPostsData = await fetchProfilePosts(sessionToken, username);
          setPosts(selfPostsData);
          const programsData = await fetchGetUserPrograms(
            sessionToken,
            username
          );
          setPrograms(programsData);
          const workflowsData = await fetchGetUserWorkflows(
            sessionToken,
            username
          );
          setWorkflows(workflowsData);
        }
      } catch (error) {
        console.error(`Error fetching ${selectedMode}:`, error);
      }
    };
    fetchContent();
  }, [selectedMode, sessionToken, username]);

  const incrementFollowers = () => {
    setFollowersCount((prevCounter) => prevCounter + 1);
  };

  const decrementFollowers = () => {
    setFollowersCount((prevCounter) => prevCounter - 1);
  };

  const renderButton = () => {
    if (username) {
      return username === sessionUsername ? (
        <>
          {userInfo.username !== "" && <EditProfileButton />}
          <EditPasswordButton />
          <div className="flex items-center cursor-pointer relative group">
            <div className="absolute bg-white z-10 top-10 right-0 hidden group-hover:block">
              <button
                className="font-medium bg-red-100 text-nowrap rounded-lg p-2 flex items-center gap-2 hover:bg-red-200 text-sm mt-1"
                onClick={() => deleteUser()}
              >
                <Trash2 size={20} weight="bold" color="#b91c1c" />
                <span className="text-red-700">Delete Profile</span>
              </button>
            </div>
            <DotsThreeVertical size={30} weight="bold" />
          </div>
        </>
      ) : (
        <FollowButton
          increment={incrementFollowers}
          decrement={decrementFollowers}
          username={username}
        />
      );
    }
    return (
      <>
        {userInfo && <EditProfileButton />}
        <div className="flex items-center cursor-pointer relative group">
          <div className="absolute bg-white z-10 top-10 right-0 hidden group-hover:block">
            <button
              className="font-medium bg-red-100 text-nowrap rounded-lg p-2 flex items-center gap-2 hover:bg-red-200 text-sm mt-1"
              onClick={() => deleteUser()}
            >
              <Trash2 size={20} weight="bold" color="#b91c1c" />
              <span className="text-red-700">Delete Profile</span>
            </button>
          </div>
          <DotsThreeVertical size={30} weight="bold" />
        </div>
      </>
    );
  };

  return (
    <div className="profile-container grid grid-cols-[1fr_3.5fr] gap-4 p-12 mt-6">
      {!userInfo && <>Loading...</>}

      {userInfo && (
        <>
          <div className="hidden lg:block">
            <Favorites />
          </div>
          <div className="profile-card border-2 border-componentBorder rounded-xl grid grid-rows-[60fr_25fr_15fr] h-[600px] mr-6 col-span-2 lg:col-span-1">
            <div
              className="border-b-2 border-componentBorder rounded-t-xl"
              style={{
                backgroundImage: `url(${userInfo.backgroundImageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            ></div>
            <div className="border-b-2 bg-componentBg border-componentBorder grid grid-cols-[15fr_67fr_18fr]">
              <div className="flex justify-center">
                <div
                  className="h-[180px] w-[180px] border-4 border-cyan-400 rounded-full mt-[-60px] ml-6 mr-2"
                  style={{
                    backgroundImage: `url(${userInfo.profileImageUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                ></div>
              </div>
              <div className="flex flex-col gap-3 p-4">
                <p className="text-xl font-semibold">{userInfo.username}</p>
                <ReadFollowsButton
                  followingCount={followingCount}
                  followersCount={followersCount}
                  followersText={followersText}
                  username={username}
                />
                <p className="text-secondaryColor text-xs font-medium">
                  <Clock color="#C7C9CE" weight="bold" size={22} /> Member Since{" "}
                  {convertTimestampToMonthYear(userInfo.joinDate)}
                </p>
              </div>
              <div className="grid grid-rows-[40fr_50fr]">
                <div className="flex gap-3 p-2">{renderButton()}</div>
              </div>
            </div>
            <div className="p-6 bg-componentBg grid grid-cols-[68fr_32fr] gap-5">
              <div className="text-secondaryColor text-sm font-medium">
                {userInfo.description}
                {notFoundUser}
              </div>
              <div className="flex justify-around items-center">
                <InstagramLogo size={24} weight="fill" />
                <YoutubeLogo size={24} weight="fill" />
                <XLogo size={24} weight="fill" />
                <TwitchLogo size={24} weight="fill" />
                <GithubLogo size={24} weight="fill" />
              </div>
            </div>
          </div>

          <div className="col-span-2 lg:col-start-2 -mt-20">
            <div className="flex gap-4 mb-4   flex-row font-medium">
              <button
                className={`py-2 px-4 rounded-md ${
                  selectedMode === "posts"
                    ? "bg-accentColor text-white"
                    : "bg-gray-200 text-gray-800"
                } hover:bg-accentColorHover`}
                onClick={() => setSelectedMode("posts")}
              >
                Posts
              </button>
              <button
                className={`py-2 px-4 rounded-md ${
                  selectedMode === "programs"
                    ? "bg-accentColor text-white"
                    : "bg-gray-200 text-gray-800"
                } hover:bg-accentColorHover`}
                onClick={() => setSelectedMode("programs")}
              >
                Programs
              </button>
              <button
                className={`py-2 px-4 rounded-md ${
                  selectedMode === "workflows"
                    ? "bg-accentColor text-white"
                    : "bg-gray-200 text-gray-800"
                } hover:bg-accentColorHover`}
                onClick={() => setSelectedMode("workflows")}
              >
                Workflows
              </button>
            </div>
            <div className="flex flex-col gap-4">
              {selectedMode === "posts" &&
                posts
                  .reverse()
                  .map((post, index) => <Post postInfo={post} key={index} />)}
              {selectedMode === "programs" &&
                programs.map((program, index) => (
                  <Program programInfo={program} key={index} />
                ))}
              {selectedMode === "workflows" &&
                workflows.map((workflow, index) => (
                  <Workflow programInfo={workflow} key={index} />
                ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Profile;
