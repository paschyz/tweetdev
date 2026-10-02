import React from "react";

const HubSelect = ({ name, updateParentState, id }) => {
  const changeParentState = () => {
    if (id != undefined) {
      updateParentState(name, id);
    } else {
      updateParentState(name);
    }
  };
  return (
    <li className="cursor-pointer" onClick={changeParentState}>
      <p>{name}</p>
    </li>
  );
};

export default HubSelect;
