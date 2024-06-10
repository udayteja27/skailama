import React from "react";

const InputField = ({ text, name, type, value, onChange, color }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "self-start",
        width: "100%",
        gap: "1rem",
      }}
    >
      <label htmlFor={name} style={{ fontSize: "1.2rem", fontWeight: "600" }}>
        {text}
      </label>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "space-between",
          gap: "10px",
        }}
      >
        <input
          name={name}
          type={type}
          style={{
            border: "1px solid gray",
            borderRadius: "10px",
            height: "2.3rem",
            width: "100%",
          }}
          value={value}
          onChange={onChange}
        />
        {color && (
          <div
            style={{
              height: "2rem",
              width: "2.3rem",
              backgroundColor: `${color}`,
              borderRadius: "10px",
            }}
          ></div>
        )}
      </div>
    </div>
  );
};

export default InputField;
