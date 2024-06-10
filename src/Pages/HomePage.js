import React, { useState } from "react";
import {
  //allProjects,
  createProject,
  createUser,
  getAllProjects,
  // loginFunction,
} from "../api/ProjectsApi";
import { useNavigate } from "react-router-dom";
import { Button } from "../Components/Button";
import { NavBar } from "../Components/NavBar";

const HomePage = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    name: "",
  });

  const [
    isCreateProjectModalVisible,
    setIsCreateProjectModalVisible,
  ] = useState(false);

  const navigate = useNavigate();

  const [isModalVisible, setIsModalVisible] = useState(true);

  const handleNameChange = (e) => {
    setCredentials({ ...credentials, [e.target.id]: e.target.value });
  };

  const handleEmailChange = (e) => {
    setCredentials({ ...credentials, [e.target.id]: e.target.value });
  };

  const [projectName, setProjectName] = useState("");

  const handleProjectCreate = async (payload) => {
    try {
      const payload = {
        projectName: projectName,
        email: localStorage.getItem("email"),
      };
      await createProject(payload);
      navigate("/all-projects");
    } catch (error) {
      console.log(error.message);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsModalVisible(false);
      await createUser(credentials);
      localStorage.setItem("email", credentials.email);
      const response = await getAllProjects({
        email: localStorage.getItem("email"),
      });
      if (response.projects.length !== 0) {
        navigate("/all-projects");
      }
    } catch (error) {}
  };
  return (
    <div className="homepage-main-container">
      <NavBar />

      <div className="homepage-middle-container">
        <h1
          style={{
            fontWeight: "700",
            fontSize: "3rem",
            color: "#7E22CE",
            margin: "0",
            paddingBottom: "4px",
          }}
        >
          Create a New Project
        </h1>
        <img
          src="https://res.cloudinary.com/dgj39147s/image/upload/v1717942223/Group_16_pen1kl.png"
          alt="homepageicon"
          style={{ height: "16rem", width: "24rem" }}
        />
        <p
          style={{
            fontFamily: "Roboto",
            fontSize: "25px",
            fontWeight: "400",
            lineHeight: "41.02px",
            textAlign: "center",
            color: "#838383",
          }}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in
        </p>
        <div
          style={{
            width: "70.83px",
            height: "70.92px",
            padding: "5px",
            top: "831px",
            left: "675px",
            gap: "0px",
            borderRadius: "12.89px",
            opacity: "0px",
            background: "#211935",
          }}
        >
          <img
            src="https://res.cloudinary.com/dgj39147s/image/upload/v1717942912/Vector_lywsrh.png"
            alt="createprojectbtn"
            style={{
              cursor: "pointer",
              width: "55.86px",
              height: "55.85px",
              top: "859.83px",
              left: "705.75px",
              gap: "0px",
              opacity: "0px",
            }}
            onClick={() => {
              setIsCreateProjectModalVisible(!isCreateProjectModalVisible);
            }}
          />
        </div>
      </div>

      {!isModalVisible && isCreateProjectModalVisible && (
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
                style={{ width: "100%", borderRadius: "10px", padding: "10px" }}
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
                }}
              />
            </div>
          </div>
        </>
      )}

      {isModalVisible && (
        <>
          <div className="modal"></div>
          <form onSubmit={handleSubmit} className="modal-container">
            <h1 style={{ color: "#7E22CE" }}>Enter email and name</h1>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "70%",
              }}
            >
              <input
                type="text"
                id="userName"
                value={credentials["userName"]}
                onChange={handleNameChange}
                placeholder="Enter User Name"
                style={{
                  borderRadius: "10px",
                  padding: "5px",
                  width: "100%",
                  height: "2.3rem",
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "70%",
              }}
            >
              <input
                type="email"
                id="email"
                value={credentials["email"]}
                onChange={handleEmailChange}
                placeholder="Enter Email"
                style={{
                  borderRadius: "10px",
                  padding: "5px",
                  width: "100%",
                  height: "2.3rem",
                }}
                required
              />
            </div>
            <button
              type="submit"
              style={{
                padding: "10px",
                backgroundColor: "#7E22CE",
                color: "white",
                borderRadius: "10px",
              }}
            >
              Submit
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default HomePage;
