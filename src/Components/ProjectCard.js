import React from "react";

const ProjectCard = ({ data, onClick }) => {
  return (
    <div className="project-card-main" onClick={onClick}>
      <div
        style={{
          height: "100%",
          width: "8rem",
          borderRadius: "10px",
          backgroundColor: "#7E22CE",
          display: "flex",
          fontSize: "5rem",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          fontWeight: "700",
        }}
      >
        SP
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "start",
          flexDirection: "column",
          gap: 0,
        }}
      >
        <h4>{data.projectName}</h4>
        <p>4 episodes</p>
        <p>last edited a week ago</p>
      </div>
    </div>
  );
};

export default ProjectCard;
