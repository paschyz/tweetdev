import { Heart, Plus } from "@phosphor-icons/react";
import React, { useEffect, useState } from "react";
import { getSession } from "../../services/sessionService";
import { fetchIsPostLiked, patchToggleLikePost } from "../../api/post";
import { EmojiSample } from "../../interfaces/EmojiSample";
function LikeButton({ sessionToken, postInfo }) {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(postInfo.like.length);
  const [emojiIndex, setEmojiIndex] = useState(0);

  const toggleLike = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    postId: string,
    emojiIndex: number
  ) => {
    event.stopPropagation();
    setEmojiIndex(emojiIndex);
    console.log(isLiked);
    setIsLiked(!isLiked);
    console.log(postId);
    if (sessionToken) {
      (async () => {
        try {
          await patchToggleLikePost(sessionToken, {
            post_id: postId,
            emojiIndex: emojiIndex,
          });
        } catch (error) {
          console.error("Error fetching post liked status:", error);
        }
      })();
    }
    if (isLiked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
  };
  useEffect(() => {
    const sessionToken = getSession();

    if (sessionToken) {
      (async () => {
        try {
          const isLiked = await fetchIsPostLiked(sessionToken, postInfo._id);

          setIsLiked(isLiked.liked);
          if (isLiked) {
            setEmojiIndex(isLiked.emojiIndex);
          }
        } catch (error) {
          console.error("Error fetching post liked status:", error);
        }
      })();
    }
  }, []);

  return (
    <div className="flex">
      <div
        onClick={(e) => toggleLike(e, postInfo._id, 0)}
        className="edit-button  hover:bg-accentColorHover cursor-pointer h-8 w-12 bg-accentColor hover:accentColorHover rounded-l-xl flex justify-center items-center gap-1 text-sm font-semibold text-secondaryColor "
      >
        {isLiked && (
          <img
            className="h-5 w-5"
            src={EmojiSample[emojiIndex].img_url_animated}
            alt="heart"
          />
        )}
        {!isLiked && <Heart size={20} weight="bold" />} {}
        <div className="text-xs ">{likes}</div>
      </div>
      <div className="px-1 relative group bg-accentColor rounded-r-xl flex items-center">
        <div className="absolute w-0  bg-accentColor rounded-sm z-10  group-hover:block group-hover:w-80 transition-all rounded-r-xl  ">
          <div className="flex gap-2 h-8 ">
            {EmojiSample.map((emoji, index) => {
              return (
                <div
                  onClick={(e) => toggleLike(e, postInfo._id, index)}
                  className="relative group/emoji hover:scale-[1.9] cursor-pointer transition-all flex items-center "
                  key={index}
                >
                  <img
                    className="h-6 w-6 absolute invisible group-hover/emoji:visible"
                    src={emoji.img_url_animated}
                    alt={emoji.name}
                  />

                  <img
                    className="h-6 w-6  group-hover/emoji:invisible"
                    src={emoji.img_url_static}
                    alt={emoji.name}
                  />
                </div>
              );
            })}
          </div>
        </div>
        <span className="flex w-5">
          <Plus weight="bold" size={16}></Plus>
        </span>
      </div>
    </div>
  );
}

export default LikeButton;
