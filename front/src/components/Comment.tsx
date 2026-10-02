import "../styles/Post.css";
import React, { useEffect, useState } from "react";
import { getSession } from "../services/sessionService";
import LikeButton from "./buttons/LikeButton";
import { Dot, Trash2 } from "lucide-react";
import MDEditor from "@uiw/react-md-editor";
import { convertTimeToPostTime, navigateTo } from "../utils/utils";
import { fetchUserProfilePictureByUsername } from "../api/user";
import { DotsThreeVertical } from "@phosphor-icons/react";

import toast from "react-hot-toast";
import { deleteWorkflow, getIsWorkflowDeletable } from "../api/workflow";
import { deleteComment, getIsCommentDeletable } from "../api/comment";

export default function Comment({ programInfo }) {
  //   const [input, setInput] = useState("");
  //   const [output, setOutput] = useState("");
  const sessionToken = getSession();
  const [userProfileImageUrl, setUserProfileImageUrl] = useState(null);
  //   const [hubnameProfileImageUrl, setHubnameProfileImageUrl] = useState(null);
  //   const isPostedinHub = programInfo.hubname ? true : false;
  const [isDeletable, setIsDeletable] = useState(false);
  const handleChildClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    path: string
  ) => {
    event.stopPropagation();
    navigateTo(path);
  };

  const postedTimeIndicator = convertTimeToPostTime(programInfo.creationDate);

  const deletePost = async (event) => {
    event.stopPropagation();
    try {
      await deleteComment(sessionToken, programInfo._id);
      toast.success("Deleted post !");

      window.location.href = "";
    } catch (error) {
      toast.error("Error deleting post ");
    }
  };

  useEffect(() => {
    const fetchUserProfileImage = async () => {
      try {
        const url = await fetchUserProfilePictureByUsername(
          sessionToken,
          programInfo.username
        );
        setUserProfileImageUrl(url);
      } catch (error) {
        console.error("Failed to fetch user profile picture:", error);
      }
    };
    const fetchIsDeletable = async () => {
      const isDeletableResponse = await getIsCommentDeletable(
        sessionToken,
        programInfo._id
      );
      setIsDeletable(isDeletableResponse);
    };
    fetchIsDeletable();
    fetchUserProfileImage();
  }, [sessionToken, programInfo.username]);
  const noClick = (e) => {
    e.stopPropagation();
    return;
  };
  const renderPostingInfo = () => {
    return (
      <div className="flex gap-3 mb-3 ">
        <div
          className="cursor-pointer bg-blue-700 w-10 h-10 rounded-full"
          onClick={(e) =>
            handleChildClick(e, `/profile/${programInfo.username}`)
          }
          style={{
            backgroundImage: `url(${userProfileImageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
        <div className="flex flex-col">
          <div
            className="text-sm font-semibold leading-normal cursor-pointer"
            onClick={(e) =>
              handleChildClick(e, `/profile/${programInfo.username}`)
            }
          >
            {programInfo.username}
          </div>
          <div className="inline mt-[-5px]">
            <span className="text-[13px] font-medium text-gray-400">
              {postedTimeIndicator}
            </span>
          </div>
        </div>
        {isDeletable && (
          <>
            <div className="flex items-center cursor-pointer relative group ml-auto">
              <div className="absolute bg-whitez-10 top-10 right-0 hidden group-hover:block ">
                <button
                  className="text-red-700 font-medium bg-red-100 text-nowrap rounded-lg  p-2 flex items-center gap-2 hover:bg-red-200 text-sm "
                  onClick={(e) => deletePost(e)}
                >
                  <Trash2 size={20} weight="bold" color="#b91c1c"></Trash2>
                  Delete Comment
                </button>
              </div>
              <DotsThreeVertical size={30} weight="bold"></DotsThreeVertical>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="bg-componentBg border-2 border-componentBorder rounded-xl p-6  ">
      {renderPostingInfo()}
      <div className="cursor-text" onClick={(e) => noClick(e)}>
        <p className="text-xs text-secondaryColor leading-relaxed mb-0 py-2">
          <MDEditor.Markdown
            source={programInfo.description}
            className="p-4 bg-inherit rounded-lg"
          />
        </p>
      </div>
      {/* <div className="flex mt-2 ">
        <LikeButton
          sessionToken={sessionToken}
          postInfo={programInfo}
        ></LikeButton>
      </div> */}
    </div>
  );
}
