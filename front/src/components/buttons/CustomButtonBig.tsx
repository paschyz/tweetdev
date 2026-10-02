import React from "react";

function CustomButtonBig({ text, color }) {
  return (
    <div
      style={{ backgroundColor: color }}
      className="edit-button cursor-pointer px-[12px] py-2 rounded-xl flex justify-center items-center gap-2 text-sm font-medium text-secondaryColor "
    >
      <div>{text}</div>
    </div>
  );
}

export default CustomButtonBig;
