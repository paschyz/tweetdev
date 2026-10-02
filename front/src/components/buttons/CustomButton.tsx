import React from "react";
import { ThumbsUp } from "lucide-react";

function lightenColor(color, percent) {
  const num = parseInt(color.replace("#", ""), 16),
    amt = Math.round(2.55 * percent),
    R = (num >> 16) + amt,
    G = ((num >> 8) & 0x00ff) + amt,
    B = (num & 0x0000ff) + amt;
  return (
    "#" +
    (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)
  );
}

function CustomButton({ Icon, color, text }) {
  const lighterColor = lightenColor(color, 80);
  const lighterColorHover = lightenColor(color, 50);
  return (
    <div
      className="w-fit px-2 py-1 rounded-md flex items-center gap-1 select-none cursor-pointer align-middle"
      style={{ backgroundColor: lighterColor }}
    >
      <Icon color={color} size={15} />
      <p className=" text-xs font-medium" style={{ color: color }}>
        {text}
      </p>
      <style>
        {`
          .button:hover {
            background-color: ${lighterColorHover};
          }
        `}
      </style>
    </div>
  );
}

export default CustomButton;
