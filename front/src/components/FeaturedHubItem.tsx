import { Users } from "@phosphor-icons/react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { navigateTo } from "../utils/utils";

function FeaturedHubItem({ hub }) {
  function formatNumber(number: number) {
    if (number >= 1000000) {
      return (number / 1000000).toFixed(1) + "M";
    } else if (number >= 1000) {
      return (number / 1000).toFixed(1) + "k";
    }
    return number;
  }
  return (
    <div className="relative portal-element border-2 border-componentBorder rounded-xl p-5 h-40 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center filter brightness-50 hover:brightness-75 transition-all"
        style={{ backgroundImage: `url(${hub.coverImageUrl})` }}
      ></div>
      <div className="flex gap-3  items-center">
        <div
          className="cursor-pointer w-12 h-12 rounded-lg z-10  "
          style={{
            backgroundImage: `url(${hub.profileImageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          onClick={() => navigateTo(`/hub/${hub.name}`)}
        ></div>
        <div className="flex flex-col z-10">
          <div
            className="cursor-pointer text-sm font-semibold leading-normal hover:text-secondaryColor transition-all"
            onClick={() => navigateTo(`/hub/${hub.name}`)}
          >
            {hub.name}
          </div>
          <div className="inline mt-[-5px]">
            <span className="text-[12px] font-semibold leading-normal">
              <Users size={18} weight="bold"></Users>{" "}
              {formatNumber(hub.users.length)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeaturedHubItem;
