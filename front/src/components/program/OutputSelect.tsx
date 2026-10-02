import React from "react";

interface OutputSelectProps {
  name: string;
  updateParentState: (name: string) => void;
  disabled?: boolean; // Add the disabled prop
}

const OutputSelect: React.FC<OutputSelectProps> = ({
  name,
  updateParentState,
  disabled,
}) => {
  const changeParentState = () => {
    if (!disabled) {
      updateParentState(name);
    }
  };

  return (
    <li
      className={`cursor-pointer ${
        disabled ? "text-gray-400 cursor-not-allowed" : ""
      }`}
      onClick={changeParentState}
    >
      <p>{name}</p>
    </li>
  );
};

export default OutputSelect;
