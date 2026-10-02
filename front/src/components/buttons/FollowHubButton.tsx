import React, { useEffect, useState } from "react";
import { fetchIsUserFollowed, followUser } from "../../api/user";
import {
  getLocalStorageItemByName,
  getSession,
} from "../../services/sessionService";
import { useLocation } from "react-router-dom";
import { UserCirclePlus, UserCircleMinus } from "@phosphor-icons/react";
import { fetchIsHubFollowedBySelf, toggleFollowHub } from "../../api/hub";

function FollowHubButton({ increment, decrement, name }) {
  const sessionToken = getSession();
  const [isFollowed, setIsFollowed] = useState(false);
  const followedText = isFollowed ? "Unfollow" : "Follow";

  const isHubFollowed = async () => {
    if (sessionToken && name) {
      try {
        const response = await fetchIsHubFollowedBySelf(sessionToken, name);
        return response.isFollowed;
      } catch (error) {
        console.error("Error fetching user info:", error);
        return false;
      }
    }
    return false;
  };

  const follow = async () => {
    try {
      isFollowed ? decrement() : increment();

      setIsFollowed(!isFollowed);
      if (sessionToken && name) {
        await toggleFollowHub(sessionToken, name);
      }
    } catch (error) {
      console.error("Error following/unfollowing user:", error);
    }
  };

  const checkIsFollowed = async () => {
    try {
      const isHubFollow = await isHubFollowed();
      setIsFollowed(isHubFollow);
    } catch (error) {
      console.error("Error fetching self info:", error);
    }
  };
  useEffect(() => {
    checkIsFollowed();
  }, [name, sessionToken]);

  return (
    <div onClick={() => follow()}>
      <div className="edit-button cursor-pointer px-[12px] py-2 hover:bg-accentColorHover bg-accentColor hover:accentColorHover rounded-xl flex justify-center items-center gap-2 text-sm font-medium text-secondaryColor ">
        {isFollowed && (
          <>
            <UserCircleMinus weight="bold" size={22}></UserCircleMinus>{" "}
            <div>{followedText}</div>
          </>
        )}
        {!isFollowed && (
          <>
            <UserCirclePlus weight="bold" size={22}></UserCirclePlus>{" "}
            <div>{followedText}</div>
          </>
        )}
      </div>
    </div>
  );
}

export default FollowHubButton;
