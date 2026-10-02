import { ApplePodcastsLogo, Users } from "@phosphor-icons/react";
import { Plus, X } from "lucide-react";
import React, { useState } from "react";
import CustomButton from "./CustomButton";
import CustomButtonBig from "./CustomButtonBig";
import { createHub } from "../../api/hub";
import { getSession } from "../../services/sessionService";
import toast from "react-hot-toast";

function CreateHubButton(props) {
  const [isCreateHubModalOpen, setIsCreateHubModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState(
    "Our community is all about celebrating victories, big and small, and sharing endless laughs along the way. If you're looking for a place where everyone knows your name (and your high scores), you've found it!"
  );
  const [profileImageUrl, setProfileImageUrl] = useState(
    "https://styles.redditmedia.com/t5_mm79h/styles/communityIcon_hn20mowlrmxc1.png"
  );
  const [coverImageUrl, setCoverImageUrl] = useState(
    "https://styles.redditmedia.com/t5_mm79h/styles/bannerBackgroundImage_n6ncpyyb2fx81.png"
  );

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
      const create = await createHub(sessionToken, hubData);
      toast.success("hub created successfully");
      window.location.href = "/";
    } catch (error) {
      toast.error("error while creating hub");
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
      <div
        className="flex gap-3 hover:bg-componentBgHover p-1 rounded cursor-pointer items-center"
        onClick={toggleCreateHubModal}
      >
        <Plus color="#c7c9ce" size={32} />
        <p className="text-secondaryColor font-medium text-sm select-none">
          Create Hub
        </p>
      </div>

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
                  <h2 className="text-lg font-semibold">Create a Hub</h2>
                </div>
                <p className="text-secondaryColor">
                  Give your hub a name and invite others.
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
                      <CustomButtonBig text={"Create Hub"} color={"#355cc9"} />
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

export default CreateHubButton;
