import React from "react";

export const Button = ({ text, style, onClick, icon }) => {
  return (
    <button style={style} onClick={onClick}>
      {icon}
      {text}
    </button>
  );
};
