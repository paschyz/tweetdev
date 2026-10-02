import React, { useEffect, useState } from "react";
import { fetchIsUserFollowed, followUser } from "../../api/user";
import {
  getLocalStorageItemByName,
  getSession,
} from "../../services/sessionService";
import { useLocation } from "react-router-dom";
import { UserCirclePlus, UserCircleMinus } from "@phosphor-icons/react";
function FollowButton({ increment, decrement, username }) {
  const sessionToken = getSession();
  const [isFollowed, setIsFollowed] = useState(false);
  const followedText = isFollowed ? "Unfollow" : "Follow";

  const isUserFollowed = async () => {
    if (sessionToken && username) {
      try {
        const response = await fetchIsUserFollowed(sessionToken, username);
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
      if (sessionToken && username) {
        await followUser(sessionToken, username);
      }
    } catch (error) {
      console.error("Error following/unfollowing user:", error);
    }
  };

  const checkIsFollowed = async () => {
    try {
      const isUserFollow = await isUserFollowed();
      setIsFollowed(isUserFollow);
    } catch (error) {
      console.error("Error fetching self info:", error);
    }
  };
  useEffect(() => {
    checkIsFollowed();
  }, [username, sessionToken]);

  return (
    <div onClick={() => follow()}>
      <div className="edit-button cursor-pointer px-[12px] py-2 bg-accentColor hover:accentColorHover rounded-xl flex justify-center items-center gap-2 text-sm font-medium text-secondaryColor ">
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

export default FollowButton;
