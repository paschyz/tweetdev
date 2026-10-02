import { ApplePodcastsLogo, Users } from "@phosphor-icons/react";
import { Pencil, Plus, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import CustomButtonBig from "./CustomButtonBig";
import { getSession } from "../../services/sessionService";
import toast from "react-hot-toast";
import { fetchSelfInfo, updateUser } from "../../api/user";
import { background } from "@chakra-ui/react";

export default function EditProfileButton() {
  const [isCreateHubModalOpen, setIsCreateHubModalOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const toggleCreateHubModal = () => {
    setIsCreateHubModalOpen((prevState) => !prevState);
  };

  useEffect(() => {
    const sessionToken = getSession();
    const fetchData = async () => {
      try {
        if (sessionToken) {
          const selfInfoData = await fetchSelfInfo(sessionToken);
          setUsername(selfInfoData.username);
          setDescription(selfInfoData.description);
          setProfileImageUrl(selfInfoData.profileImageUrl);
          setCoverImageUrl(selfInfoData.backgroundImageUrl);
        }
      } catch (error) {
        console.error("error while fetching user hubs", error);
      }
    };
    fetchData();
  }, []);
  const handleSubmit = async () => {
    const hubData = {
      username,
      description,
      profileImageUrl,
      backgroundImageUrl: coverImageUrl,
    };
    try {
      const sessionToken = getSession();
      const update = await updateUser(sessionToken, hubData);
      toast.success("profile updated successfully");
      localStorage.setItem("username", JSON.stringify(username));
      window.location.href = "/profile/" + username;
    } catch (error) {
      toast.error("error while updating profile");
    }
  };

  return (
    <div>
      <div
        className="flex gap-2 bg-accentColor hover:bg-accentColorHover px-2 py-2 rounded cursor-pointer items-center"
        onClick={toggleCreateHubModal}
      >
        <Pencil color="#c7c9ce" size={20} />
        <p className=" font-medium text-sm select-none">Edit Profile</p>
      </div>

      {isCreateHubModalOpen && (
        <div className="fixed -top-36 inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black opacity-50"
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
                      <CustomButtonBig
                        text={"Update Profile"}
                        color={"#355cc9"}
                      />
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
