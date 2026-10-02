import { PencilSimple } from "@phosphor-icons/react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { updateUser } from "../../api/user";
import { getSession } from "../../services/sessionService";
import { Button, Form, Modal } from "react-bootstrap";

function EditButton({ selfInfo }: { selfInfo: UserResponse }) {
  const [show, setShow] = useState(false);
  const [userInfo, setUserInfo] = useState({
    username: "",
    description: "",
    profileImageUrl: "",
    backgroundImageUrl: "",
  });

  useEffect(() => {
    setUserInfo({
      username: selfInfo.username,
      description: selfInfo.description,
      profileImageUrl: selfInfo.profileImageUrl,
      backgroundImageUrl: selfInfo.backgroundImageUrl,
    });
  }, [selfInfo]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUserInfo({
      ...userInfo,
      [name]: value,
    });
  };

  const handleClose = () => {
    setShow(false);
  };

  const handleSave = (userInfo: any) => {
    updateUser(getSession(), userInfo);

    toast.success("Changes done !", { duration: 1000 });

    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };
  const handleShow = () => {
    setShow(true);
  };

  return (
    <>
      <div
        onClick={handleShow}
        className="edit-button cursor-pointer px-[12px] py-2 bg-accentColor hover:accentColorHover rounded-xl flex justify-center items-center gap-2 text-sm font-medium text-secondaryColor "
      >
        <PencilSimple weight="bold" size={22}></PencilSimple> <div>Edit</div>
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton className="bg-componentBg">
          <Modal.Title>Edit profile</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-componentBg">
          <Form>
            <Form.Group className="mb-3" controlId="username">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                autoFocus
                name="username"
                value={userInfo.username}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={userInfo.description}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="profileImageUrl">
              <Form.Label>profileImageUrl</Form.Label>
              <Form.Control
                type="text"
                autoFocus
                name="profileImageUrl"
                value={userInfo.profileImageUrl}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="backgroundImageUrl">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                autoFocus
                name="backgroundImageUrl"
                value={userInfo.backgroundImageUrl}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="bg-componentBg">
          <Button
            className="bg-componentBg"
            variant="secondary"
            onClick={handleClose}
          >
            Close
          </Button>
          <Button
            className="bg-componentBg"
            variant="primary"
            onClick={() => handleSave(userInfo)}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default EditButton;
