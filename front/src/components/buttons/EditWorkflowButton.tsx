import { ApplePodcastsLogo, Users } from "@phosphor-icons/react";
import { Pencil, Plus, X } from "lucide-react";
import React, { useState } from "react";
import CustomButton from "./CustomButton";
import CustomButtonBig from "./CustomButtonBig";
import { createHub } from "../../api/hub";
import { getSession } from "../../services/sessionService";
import toast from "react-hot-toast";
import { updateUser } from "../../api/user";

export default function EditWorkflowButton(props) {
  const [isCreateHubModalOpen, setIsCreateHubModalOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("Workflow Title");
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
      username,
      description,
      profileImageUrl,
      coverImageUrl,
    };
    try {
      const sessionToken = getSession();
      const update = await updateUser(sessionToken, hubData);
      toast.success("profile updated successfully");
      window.location.href = "";
    } catch (error) {
      toast.error("error while updating profile");
    }
  };

  return (
    <div>
      <div className="" onClick={toggleCreateHubModal}>
        {" "}
        <CustomButton
          text={"Edit"}
          color={"#0062ff"}
          Icon={Pencil}
        ></CustomButton>
      </div>

      {isCreateHubModalOpen && (
        <div className="fixedz-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="fixed bg-black opacity-50"
            onClick={toggleCreateHubModal}
          ></div>

          {/* Modal */}
          <div className="bg-bodyBg p-4 rounded shadow-lg relative z-10 w-8/12 h-3/6">
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
                  <h2 className="text-lg font-semibold">Edit Profile</h2>
                </div>
                <p className="text-secondaryColor">
                  Update your profile, make it uniquely yours!
                </p>
                {/* Modal content */}
                <div className="flex flex-col gap-1">
                  <p>Username</p>
                  <input
                    className="rounded py-2 px-4 focus:outline-blue-600 outline-none bg-componentBg"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
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
              <div className="flex flex-col justify-between mt-6    ">
                <div className="flex">
                  <div className="flex gap-2 ml-auto">
                    <div
                      className="border-2 rounded-lg border-componentBorder"
                      onClick={toggleCreateHubModal}
                    >
                      <CustomButtonBig text={"Cancel"} color={""} />
                    </div>
                    <div onClick={handleSubmit}>
                      <CustomButtonBig text={"Create Hub"} color={"blue"} />
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
