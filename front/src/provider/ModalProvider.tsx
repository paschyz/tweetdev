// src/provider/ModalContext.js
import React, { createContext, useState, useContext } from "react";

// Create the context
const ModalContext = createContext({});

// Create the provider component
const ModalProvider = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);

  const openModal = (data) => {
    setModalData(data);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalData(null);
  };

  return (
    <ModalContext.Provider
      value={{ isModalOpen, openModal, closeModal, modalData }}
    >
      {children}
    </ModalContext.Provider>
  );
};

// Create a custom hook for using the context
const useModal = () => useContext(ModalContext);

export { ModalProvider, useModal };
