import { ApplePodcastsLogo, Users } from "@phosphor-icons/react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import React, { useState } from "react";
import CustomButton from "./CustomButton";
import CustomButtonBig from "./CustomButtonBig";
import { createHub, updateHub } from "../../api/hub";
import { getSession } from "../../services/sessionService";
import toast from "react-hot-toast";

export default function EditHubButton({ hub }) {
  const [isCreateHubModalOpen, setIsCreateHubModalOpen] = useState(false);
  const [name, setName] = useState(hub?.name || "");
  const currentName = hub?.name || "";
  const [description, setDescription] = useState(hub?.description || "");
  const [profileImageUrl, setProfileImageUrl] = useState(
    hub?.profileImageUrl || ""
  );
  const [coverImageUrl, setCoverImageUrl] = useState(hub?.coverImageUrl || "");

  const toggleCreateHubModal = () => {
    setIsCreateHubModalOpen((prevState) => !prevState);
  };

  const handleSubmit = async () => {
    const hubData = {
      name,
      description,
      profileImageUrl,
      coverImageUrl,
    };
    try {
      const sessionToken = getSession();
      const update = await updateHub(sessionToken, currentName, hubData);
      toast.success("hub updated successfully");
      window.location.href = "/hub/" + name;
    } catch (error) {
      toast.error("error while updating hub");
    }
    console.log(hubData);
    setName("");
    setDescription("");
    setProfileImageUrl("");
    setCoverImageUrl("");
    toggleCreateHubModal();
  };

  return (
    <div>
      <button
        className="font-medium bg-blue-100 text-nowrap rounded-lg  p-2 flex items-center gap-2 hover:bg-blue-200 text-sm  w-28"
        onClick={toggleCreateHubModal}
      >
        <Pencil size={20} weight="bold" color="#1d4ed8"></Pencil>
        <span className="text-blue-700 ">Edit Hub</span>
      </button>

      {isCreateHubModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="fixed  inset-0 bg-black opacity-50"
            onClick={toggleCreateHubModal}
          ></div>

          {/* Modal */}
          <div className="bg-bodyBg -top-24 p-4 rounded shadow-lg relative z-10 w-8/12 h-3/6">
            <div className="flex justify-end">
              <button
                className="text-secondaryColor font-medium text-sm"
                onClick={toggleCreateHubModal}
              >
                <X />
              </button>
            </div>
            <div className="">
              <div className="p-2 -mt-5 flex flex-col gap-3">
                <div className="flex gap-3 items-center ml-[3px]">
                  <ApplePodcastsLogo weight="bold" size={36} />
                  <h2 className="text-lg font-semibold">Edit Hub</h2>
                </div>
                <p className="text-secondaryColor">
                  Want to refine your hub ? Enhance your hub with a new
                  identity.
                </p>
                {/* Modal content */}
                <div className="flex flex-col gap-1">
                  <p>Hub name</p>
                  <input
                    className="rounded py-2 px-4 focus:outline-blue-600 outline-none bg-componentBg"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <p>Description</p>
                  <input
                    className="rounded py-2 px-4 focus:outline-blue-600 outline-none bg-componentBg"
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <p>Icon URL</p>
                  <input
                    className="rounded py-2 px-4 focus:outline-blue-600 outline-none bg-componentBg"
                    type="text"
                    value={profileImageUrl}
                    onChange={(e) => setProfileImageUrl(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <p>Banner URL</p>
                  <input
                    className="rounded py-2 px-4 focus:outline-blue-600 outline-none bg-componentBg"
                    type="text"
                    value={coverImageUrl}
                    onChange={(e) => setCoverImageUrl(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex flex-col justify-between -mt-4">
                <div className="relative portal-element border-2 border-componentBorder rounded-xl p-5 h-40 overflow-hidden mt-16">
                  <div
                    className="absolute inset-0 bg-cover bg-center filter brightness-50 hover:brightness-75 transition-all"
                    style={{ backgroundImage: `url(${coverImageUrl})` }}
                  ></div>
                  <div className="flex gap-3  items-center">
                    <div
                      className="cursor-pointer w-12 h-12 rounded-lg z-10  "
                      style={{
                        backgroundImage: `url(${profileImageUrl})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    ></div>
                    <div className="flex flex-col z-10">
                      <div className="cursor-pointer text-sm font-semibold leading-normal hover:text-secondaryColor transition-all">
                        {name}
                      </div>
                      <div className="inline mt-[-5px]">
                        <span className="text-[12px] font-semibold leading-normal">
                          <Users size={18} weight="bold"></Users> 1
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex mt-4">
                  <div className="flex gap-2 ml-auto">
                    <div
                      className="border-2 rounded-lg border-componentBorder"
                      onClick={toggleCreateHubModal}
                    >
                      <CustomButtonBig text={"Cancel"} color={""} />
                    </div>
                    <div onClick={handleSubmit}>
                      <CustomButtonBig text={"Update Hub"} color={"#355cc9"} />
                    </div>
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
