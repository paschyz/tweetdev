import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { updateUser } from "../api/user";
import { getSession } from "../services/sessionService";
import toast from "react-hot-toast";

function ModalFollowers({ followersCount, followersText }) {
  return (
    <>
      <div className="followers flex gap-1">
        {" "}
        <div className="text-xs">{followersCount}</div>{" "}
        <p className="text-accentColor font-semibold text-xs flex flex-row-reverse">
          {" "}
          {followersText}
        </p>
      </div>
    </>
  );
}

export default ModalFollowers;
