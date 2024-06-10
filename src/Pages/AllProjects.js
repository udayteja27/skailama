import React, { useEffect, useState } from "react";
import { NavBar } from "../Components/NavBar";
import ProjectCard from "../Components/ProjectCard";
import { createProject, getAllProjects } from "../api/ProjectsApi";
import { Button } from "../Components/Button";
import { useNavigate } from "react-router-dom";

const AllProjects = () => {
  const [allProjectsData, setAllProjectsData] = useState([]);

  const navigate = useNavigate();

  const retrieveAllProjects = async () => {
    try {
      const response = await getAllProjects({
        email: localStorage.getItem("email"),
      });

      setAllProjectsData(response.projects);

      console.log(response);
    } catch (error) {}
  };
  const [projectName, setProjectName] = useState("");

  const [
    isCreateProjectModalVisible,
    setIsCreateProjectModalVisible,
  ] = useState(false);

  const handleProjectCreate = async (payload) => {
    try {
      const payload = {
        projectName: projectName,
        email: localStorage.getItem("email"),
      };
      const response = await createProject(payload);
      setAllProjectsData(response.projects);
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    retrieveAllProjects();
  }, []);

  return (
    <div className="all-projects-main">
      <NavBar />
      <div className="all-projects-inner">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <h1 style={{ fontSize: "3rem", color: "#7E22CE" }}>Projects</h1>
          <img
            src="images/createprojectbtn.svg"
            alt="icon"
            style={{ height: "3rem" }}
            onClick={() => {
              setIsCreateProjectModalVisible(!isCreateProjectModalVisible);
            }}
          />
        </div>

        <div className="all-projects-grid">
          {allProjectsData.length !== 0 &&
            allProjectsData.map((obj, i) => {
              return (
                <ProjectCard
                  data={obj}
                  key={i}
                  onClick={() => {
                    navigate(`/project?id=${obj._id}`);
                  }}
                />
              );
            })}
        </div>

        {isCreateProjectModalVisible && (
          <>
            <div className="modal"></div>
            <div
              className="modal-container"
              style={{ gap: "4px", alignItems: "start", width: "70%" }}
            >
              <h1 className="">Create Project</h1>
              <div style={{ width: "100%" }}>
                <h4>Enter Project Name:</h4>
                <textarea
                  required
                  value={projectName}
                  style={{
                    width: "100%",
                    borderRadius: "10px",
                    padding: "10px",
                  }}
                  onChange={(e) => setProjectName(e.target.value)}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  alignItems: "center",
                  width: "100%",
                  justifyContent: "end",
                }}
              >
                <div
                  style={{ color: "red", cursor: "pointer" }}
                  onClick={() =>
                    setIsCreateProjectModalVisible(!isCreateProjectModalVisible)
                  }
                >
                  {" "}
                  cancel
                </div>
                <Button
                  text={"Create"}
                  style={{
                    backgroundColor: "#7E22CE",
                    padding: "10px",
                    borderRadius: "10px",
                    color: "white",
                    alignSelf: "end",
                  }}
                  onClick={() => {
                    handleProjectCreate();
                    setIsCreateProjectModalVisible(
                      !isCreateProjectModalVisible
                    );
                    setProjectName("");
                  }}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AllProjects;
