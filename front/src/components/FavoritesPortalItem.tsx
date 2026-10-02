import React from "react";
import { IHub } from "../interfaces/IHub";

function FavoritesPortalItem({
  source,
  type,
}: {
  source: IHub | UserResponse;
  type: "hub" | "user";
}) {
  const getPath = () => {
    return type === "hub"
      ? `/hub/${source.name}`
      : `/profile/${source.username}`;
  };

  const handleClick = () => {
    window.location.href = getPath();
  };

  const containerStyle = {
    backgroundImage: `url(${source.profileImageUrl})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    borderRadius: type === "hub" ? "0.5rem" : "9999px",
  };
  return (
    <div className="flex gap-2 hover:bg-componentBgHover rounded p-1">
      <div
        className="cursor-pointer w-9 h-9 flex-shrink-0"
        onClick={handleClick}
        style={containerStyle}
      ></div>
      <div className="cursor-pointer flex items-center" onClick={handleClick}>
        <p className="text-secondaryColor font-medium text-sm">
          {type === "hub" ? source.name : source.username}
        </p>
      </div>
    </div>
  );
}

export default FavoritesPortalItem;
