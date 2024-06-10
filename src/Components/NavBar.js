import React from "react";

export const NavBar = () => {
  return (
    <div className="header">
      <div className="company-logo">
        <img
          src="images/logo.svg"
          alt="icon"
          style={{ height: "30px", width: "30px" }}
        />
        <h1
          style={{
            font: "Plus Jakarta Sans",
            color: "#7E22CE",
            fontWeight: "800",
          }}
        >
          LAMA
        </h1>
      </div>
      <div className="notification-setting">
        <img
          src="https://res.cloudinary.com/dgj39147s/image/upload/v1717942502/icon_ylw6xw.png"
          alt="settings"
          style={{ height: "2.3rem", width: "2.3rem" }}
        />
        <img
          src="https://res.cloudinary.com/dgj39147s/image/upload/v1717942595/notifications_tnvudj.png"
          alt="notification"
          style={{ height: "2.3rem", width: "2.3rem" }}
        />
      </div>
    </div>
  );
};
