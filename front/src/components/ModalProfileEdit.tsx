import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { updateUser } from "../api/user";
import { getSession } from "../services/sessionService";
import toast from "react-hot-toast";

function ModalProfileEdit({ selfInfo }: { selfInfo: UserResponse }) {
  const [show, setShow] = useState(false);
  const [userInfo, setUserInfo] = useState({
    username: "",
    description: "",
  });

  useEffect(() => {
    setUserInfo({
      username: selfInfo.username,
      description: selfInfo.description,
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
      <Button variant="primary" onClick={handleShow}>
        Edit profile
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() => handleSave(userInfo)}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalProfileEdit;
