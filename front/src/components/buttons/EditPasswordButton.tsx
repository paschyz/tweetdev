import { Pencil, X } from "lucide-react";
import React, { useState } from "react";
import CustomButtonBig from "./CustomButtonBig";
import { updatePassword, updateUser } from "../../api/user";
import { getSession } from "../../services/sessionService";
import toast from "react-hot-toast";

export default function EditPasswordButton() {
  const [isUpdatePasswordModalOpen, setIsUpdatePasswordModalOpen] =
    useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const toggleUpdatePasswordModal = () => {
    setIsUpdatePasswordModalOpen((prevState) => !prevState);
  };

  const handleSubmit = async () => {
    if (newPassword !== confirmNewPassword) {
      toast.error("New passwords do not match");
      return;
    }

    const passwordData = {
      currentPassword,
      newPassword,
    };

    try {
      const sessionToken = getSession();
      await updatePassword(sessionToken, passwordData);
      toast.success("Password updated successfully");
      toggleUpdatePasswordModal();
    } catch (error) {
      toast.error("Error while updating password");
    }
  };

  return (
    <div>
      <div
        className="flex gap-2 bg-accentColor hover:bg-accentColorHover px-2 py-2 rounded cursor-pointer items-center"
        onClick={toggleUpdatePasswordModal}
      >
        <Pencil color="#c7c9ce" size={20} />
        <p className="font-medium text-sm select-none">Update Password</p>
      </div>

      {isUpdatePasswordModalOpen && (
        <div className="fixed -top-36 inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={toggleUpdatePasswordModal}
          ></div>

          {/* Modal */}
          <div className="bg-bodyBg p-4 rounded shadow-lg relative z-10 w-8/12 h-3/6">
            <div className="flex justify-end">
              <button
                className="text-secondaryColor font-medium text-sm"
                onClick={toggleUpdatePasswordModal}
              >
                <X />
              </button>
            </div>
            <div className="">
              <div className="p-2 -mt-5 flex flex-col gap-3">
                <div className="flex gap-3 items-center ml-[3px]">
                  <Pencil color="#c7c9ce" size={36} />
                  <h2 className="text-lg font-semibold">Update Password</h2>
                </div>
                <p className="text-secondaryColor">
                  Update your password for better security.
                </p>
                {/* Modal content */}
                <div className="flex flex-col gap-1">
                  <p>Current Password</p>
                  <input
                    className="rounded py-2 px-4 focus:outline-blue-600 outline-none bg-componentBg"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <p>New Password</p>
                  <input
                    className="rounded py-2 px-4 focus:outline-blue-600 outline-none bg-componentBg"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <p>Confirm New Password</p>
                  <input
                    className="rounded py-2 px-4 focus:outline-blue-600 outline-none bg-componentBg"
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex flex-col justify-between mt-6">
                <div className="flex">
                  <div className="flex gap-2 ml-auto">
                    <div
                      className="border-2 rounded-lg border-componentBorder"
                      onClick={toggleUpdatePasswordModal}
                    >
                      <CustomButtonBig text={"Cancel"} color={""} />
                    </div>
                    <div onClick={handleSubmit}>
                      <CustomButtonBig
                        text={"Update Password"}
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
