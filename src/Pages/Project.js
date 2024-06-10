import React, { useEffect, useState } from "react";
import { Button } from "../Components/Button";
import { IoLogoYoutube } from "react-icons/io";
import { AiOutlineSpotify } from "react-icons/ai";
import { useLocation, useNavigate } from "react-router-dom";
import {
  addProjectDetails,
  deleteTranscript,
  // eslint-disable-next-line
  editProjectDetails,
  getImageUrl,
  getProject,
  saveEdittedFile,
  saveProject,
} from "../api/ProjectsApi";
import InputField from "../Components/InputField";
import { formatTimestamp } from "../utils";
import { IoSettingsSharp } from "react-icons/io5";
import Loader from "../Components/Loader";
import Settings from "../Components/Settings";

const Project = () => {
  const id = new URLSearchParams(useLocation().search).get("id");

  const [imageFile, setImageFile] = useState(null);

  const [viewEditTranscript, setViewEditTranscript] = useState(false);

  const [currentWidgetOpen, setCurrentWidgetOpen] = useState("general");

  const [widgetConfigurationObject, setWidgetConfigurationObject] = useState(
    {}
  );

  const [loader, setLoader] = useState(false);

  const [transcriptArray, setTranscriptArray] = useState([]);

  const [textEditable, setTextEditable] = useState(false);

  const [currentTab, setCurrentTab] = useState("projects");

  const [projectData, setProjectData] = useState({});

  const [transcriptDescription, setTranscriptDescription] = useState();
  const [transcriptSave, setTranscriptSave] = useState(false);

  const [fileDetails, setFileDetails] = useState({
    name: "",
    description: "",
  });

  const navigate = useNavigate();

  const getProjectData = async () => {
    try {
      const response = await getProject({
        email: localStorage.getItem("email"),
        pId: id,
      });
      setProjectData(response);
      setWidgetConfigurationObject(response.widgetConfiguration);
      console.log(response);
      setTranscriptArray(response.projectDetails);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleImageUplaod = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setImageFile(selectedFile);
    } else {
      alert("Please select a valid image file");
    }
  };

  const handleTranscriptDelete = async (tId) => {
    try {
      console.log(tId);
      const response = await deleteTranscript({
        projectId: id,
        transcriptId: tId,
      });

      setTranscriptArray(response.projectDetails);
    } catch (error) {}
  };

  const handleSaveProject = async () => {
    setLoader(true);
    try {
      const { url } = await getImageUrl();

      await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": imageFile.type,
        },
        body: imageFile,
      });

      const s3Url = url.split("?")[0]; // Extract the S3 URL without query parameters
      console.log(imageFile);

      const projectFile = {
        ...projectData,
        widgetConfiguration: {
          ...widgetConfigurationObject,
          // eslint-disable-next-line
          display: { ...widgetConfigurationObject.display, ["botIcon"]: s3Url },
        },
      };

      setWidgetConfigurationObject((prev) => ({
        ...prev,
        display: {
          ...prev.display,
          // eslint-disable-next-line
          ["botIcon"]: s3Url,
        },
      }));
      const response = await saveProject({ pId: id, project: projectFile });
      setImageFile(null);
      setProjectData(response);
    } catch (error) {
      navigate("/");
    }
    setLoader(false);
  };

  const handleUploadDescription = async () => {
    try {
      const response = await addProjectDetails({ pId: id, ...fileDetails });
      setProjectData(response);
      setTranscriptArray(response.projectDetails);
      console.log(response);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleTranscriptModalDescription = (fileId) => {
    const file = projectData.projectDetails.filter((obj) => obj._id === fileId);
    setTranscriptDescription({ id: fileId, description: file[0].description });
    console.log(transcriptDescription);
  };

  const handleEditTranscriptInput = (e) => {
    setTranscriptDescription({
      ...transcriptDescription,
      // eslint-disable-next-line
      ["description"]: e.target.value,
    });
  };

  const handleSaveEditTranscript = async () => {
    try {
      const response = await saveEdittedFile(transcriptDescription);
      const fileIndex = projectData?.projectDetails?.findIndex(
        (obj) => obj._id === transcriptDescription.id
      );
      const updatedProjectDetails = [...projectData.projectDetails];
      updatedProjectDetails[fileIndex] = response;

      setProjectData({ ...projectData, projectDetails: updatedProjectDetails });
    } catch (error) {}
  };

  useEffect(() => {
    getProjectData();
  });

  return (
    <div className="project-main-container">
      <div className="left-portion-project">
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

        <h3 style={{ color: "#49454F" }}>Podcast Uplaod Flow</h3>

        <div
          className="navigate-button"
          onClick={() => setCurrentTab("projects")}
          style={
            currentTab === "projects"
              ? { color: "white", backgroundColor: "#7E22CE" }
              : { color: "black" }
          }
        >
          <h4>Projects</h4>
        </div>
        <div
          className="navigate-button"
          onClick={() => setCurrentTab("widgetConfigurations")}
          style={
            currentTab === "widgetConfigurations"
              ? { color: "white", backgroundColor: "#7E22CE" }
              : { color: "black" }
          }
        >
          <h4>Widget Configurations</h4>
        </div>
        <div className="navigate-button">
          <h4>Deployment</h4>
        </div>
        <div className="navigate-button">
          <h4> Pricing</h4>
        </div>
        <div
          className="navigate-button"
          style={
            currentTab === "settings"
              ? {
                  color: "white",
                  backgroundColor: "#7E22CE",
                  position: "absolute",
                  bottom: "10px",
                  fontSize: "1.5rem",
                  fontWeight: "600",
                  width: "90%",
                }
              : {
                  color: "black",
                  position: "absolute",
                  bottom: "10px",
                  fontSize: "1.5rem",
                  fontWeight: "600",
                  width: "90%",
                }
          }
          onClick={() => setCurrentTab("settings")}
        >
          <IoSettingsSharp style={{ marginRight: "5px" }} />
          Settings
        </div>
      </div>

      {loader && <Loader />}

      <div className="right-portion-project">
        {!viewEditTranscript && currentTab === "projects" && (
          <>
            <h2
              style={{ color: "#7E22CE", fontWeight: "700", fontSize: "3rem" }}
            >
              Sample Project
            </h2>
            <div
              style={{
                display: "flex",
                justifyContent: "space-evenly",
                alignItems: "center",
                width: "100%",
                flexWrap: "wrap",
                gap: "1rem",
              }}
            >
              <Button
                icon={
                  <IoLogoYoutube style={{ color: "red", fontSize: "20px" }} />
                }
                onClick={() => setTranscriptSave(!transcriptSave)}
                text={"upload video"}
                style={{
                  padding: "10px",
                  borderRadius: "10px",
                  boxShadow: "2px 2px 2px 2px #C8C8C8",
                  background: "white",
                  cursor: "pointer",
                  display: "flex",
                  gap: 2,
                  alignItems: "center",
                  border: "1px",
                }}
              />
              <Button
                icon={
                  <AiOutlineSpotify
                    style={{ color: "green", fontSize: "20px" }}
                  />
                }
                onClick={() => setTranscriptSave(!transcriptSave)}
                text={"upload video"}
                style={{
                  padding: "10px",
                  borderRadius: "10px",
                  boxShadow: "2px 2px 2px 2px #C8C8C8",
                  background: "white",
                  cursor: "pointer",
                  display: "flex",
                  gap: 2,
                  alignItems: "center",
                  border: "1px",
                }}
              />
              <Button
                icon={
                  <IoLogoYoutube style={{ color: "red", fontSize: "20px" }} />
                }
                text={"upload video"}
                onClick={() => setTranscriptSave(!transcriptSave)}
                style={{
                  padding: "10px",
                  borderRadius: "10px",
                  boxShadow: "2px 2px 2px 2px #C8C8C8",
                  background: "white",
                  cursor: "pointer",
                  display: "flex",
                  gap: 2,
                  alignItems: "center",
                  border: "1px",
                }}
              />
              <Button
                icon={
                  <IoLogoYoutube style={{ color: "red", fontSize: "20px" }} />
                }
                text={"upload video"}
                onClick={() => setTranscriptSave(!transcriptSave)}
                style={{
                  padding: "10px",
                  borderRadius: "10px",
                  boxShadow: "2px 2px 2px 2px #C8C8C8",
                  background: "white",
                  cursor: "pointer",
                  display: "flex",
                  gap: 2,
                  alignItems: "center",
                  border: "1px",
                }}
              />
            </div>
            <div
              style={{
                width: "100%",
                borderRadius: "15px",
                background: "#7E22CE",
                height: "3rem",
              }}
            ></div>

            <div className="table-container">
              {projectData.length !== 0 && (
                <table>
                  <thead>
                    <tr>
                      <td>Name</td>
                      <td>Upload Date & Time</td>
                      <td>Status</td>
                      <td>Actions</td>
                    </tr>
                  </thead>
                  <tbody>
                    {transcriptArray.length !== 0 &&
                      transcriptArray.map((obj, i) => {
                        return (
                          <tr key={i}>
                            <td>{obj.name}</td>
                            <td>{formatTimestamp(obj.time)}</td>
                            <td>Done</td>
                            <td
                              style={{
                                display: "flex",
                                gap: "10px",
                                alignItems: "center",
                              }}
                            >
                              <Button
                                style={{
                                  cursor: "pointer",
                                  padding: "5px",
                                  borderRadius: "10px",
                                  color: "red",
                                  backgroundColor: "white",
                                  border: "1px solid",
                                  boxShadow: "1px 1px 1px 1px gray",
                                }}
                                text={"edit"}
                                onClick={() => {
                                  setViewEditTranscript(!viewEditTranscript);
                                  handleTranscriptModalDescription(obj._id);
                                }}
                              />
                              <Button
                                style={{
                                  cursor: "pointer",
                                  padding: "5px",
                                  borderRadius: "10px",
                                  color: "white",
                                  backgroundColor: "red",
                                  border: "1px solid",
                                  boxShadow: "1px 1px 1px 1px gray",
                                }}
                                text={"Delete"}
                                onClick={() => handleTranscriptDelete(obj._id)}
                              />
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}

        {viewEditTranscript && (
          <>
            <h2
              style={{ color: "#7E22CE", fontWeight: "700", fontSize: "3rem" }}
            >
              Sample Project
            </h2>
            <div className="transcript-edit-modal">
              <div className="edit-modal-first-section">
                <h1 style={{ color: "#7E22CE" }}>Edit Transcript</h1>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "2rem",
                  }}
                >
                  <Button
                    style={{
                      padding: "10px",
                      borderRadius: "10px",
                      border: "1px solid",
                      backgroundColor: "black",
                      color: "white",
                      boxShadow: "1px 1px 1px 1px gray",
                      cursor: "pointer",
                    }}
                    text={!textEditable ? "Enable Edit" : "Disable Edit"}
                    onClick={() => setTextEditable(!textEditable)}
                  />
                  <Button
                    style={{
                      border: "2px solid red",
                      color: "red",
                      padding: "10px",
                      borderRadius: "10px",
                      cursor: "pointer",
                      backgroundColor: "white",
                      boxShadow: "1px 1px 1px 1px gray",
                    }}
                    text={"Discard"}
                    onClick={() => setViewEditTranscript(!viewEditTranscript)}
                  />
                  <Button
                    style={{
                      backgroundColor: "#211935",
                      color: "white",
                      padding: "10px",
                      borderRadius: "10px",
                      cursor: "pointer",
                      boxShadow: "1px 1px 1px 1px gray",
                    }}
                    text={"Save & exit"}
                    onClick={() => {
                      setViewEditTranscript(!viewEditTranscript);
                      handleSaveEditTranscript();
                    }}
                  />
                </div>{" "}
              </div>
              <textarea
                className="transcript-edit-input-div"
                value={transcriptDescription.description}
                onChange={(e) => {
                  textEditable && handleEditTranscriptInput(e);
                }}
              ></textarea>
            </div>
          </>
        )}

        {!viewEditTranscript && currentTab === "widgetConfigurations" && (
          <div className="widget-div">
            <h1 style={{ color: "#7E22CE", fontSize: "3rem" }}>
              Configuration
            </h1>
            <div className="widget-select-div">
              <h4
                style={
                  currentWidgetOpen === "general"
                    ? { color: "#7E22CE", cursor: "pointer" }
                    : { cursor: "pointer" }
                }
                onClick={() => setCurrentWidgetOpen("general")}
              >
                General
              </h4>
              <h4
                style={
                  currentWidgetOpen === "display"
                    ? { color: "#7E22CE", cursor: "pointer" }
                    : { cursor: "pointer" }
                }
                onClick={() => setCurrentWidgetOpen("display")}
              >
                Display
              </h4>
            </div>

            {currentWidgetOpen === "general" && (
              <div className="general-div">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "self-start",
                    width: "100%",
                    gap: "1rem",
                  }}
                >
                  <label
                    htmlFor="chatbot"
                    style={{ fontSize: "1.2rem", fontWeight: "600" }}
                  >
                    Chatbot Name
                  </label>
                  <input
                    name="chatbot"
                    type="text"
                    style={{
                      border: "1px solid gray",
                      borderRadius: "10px",
                      height: "2rem",
                      width: "100%",
                    }}
                    value={widgetConfigurationObject.general.chatbot}
                    onChange={(e) => {
                      setWidgetConfigurationObject({
                        ...widgetConfigurationObject,
                        general: {
                          ...widgetConfigurationObject.general,
                          // eslint-disable-next-line
                          ["chatbot"]: e.target.value,
                        },
                      });
                    }}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "self-start",
                    width: "100%",
                    gap: "1rem",
                  }}
                >
                  <label
                    htmlFor="chatbot"
                    style={{ fontSize: "1.2rem", fontWeight: "600" }}
                  >
                    welcome Message
                  </label>
                  <input
                    name="chatbot"
                    type="text"
                    style={{
                      border: "1px solid gray",
                      borderRadius: "10px",
                      height: "2rem",
                      width: "100%",
                    }}
                    value={widgetConfigurationObject.general.welcomeMessage}
                    onChange={(e) => {
                      setWidgetConfigurationObject({
                        ...widgetConfigurationObject,
                        general: {
                          ...widgetConfigurationObject.general,
                          // eslint-disable-next-line
                          ["welcomeMessage"]: e.target.value,
                        },
                      });
                    }}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "self-start",
                    width: "100%",
                    gap: "1rem",
                  }}
                >
                  <label
                    htmlFor="chatbot"
                    style={{ fontSize: "1.2rem", fontWeight: "600" }}
                  >
                    Input PlaceHolder
                  </label>
                  <input
                    name="chatbot"
                    type="text"
                    style={{
                      border: "1px solid gray",
                      borderRadius: "10px",
                      height: "2rem",
                      width: "100%",
                    }}
                    value={widgetConfigurationObject.general.inputMessage}
                    onChange={(e) => {
                      setWidgetConfigurationObject({
                        ...widgetConfigurationObject,
                        general: {
                          ...widgetConfigurationObject.general,
                          // eslint-disable-next-line
                          ["inputPlaceholder"]: e.target.value,
                        },
                      });
                    }}
                  />
                </div>
              </div>
            )}

            {currentWidgetOpen === "display" && (
              <div className="display-div">
                <div className="first-section-display">
                  <InputField
                    onChange={(e) => {
                      setWidgetConfigurationObject({
                        ...widgetConfigurationObject,
                        display: {
                          ...widgetConfigurationObject.display,
                          // eslint-disable-next-line
                          ["primaryColor"]: e.target.value,
                        },
                      });
                    }}
                    value={widgetConfigurationObject.display.primaryColor}
                    text={"Position On Screen"}
                    type={"text"}
                    name={"primaryColor"}
                    color={widgetConfigurationObject.display.primaryColor}
                  />
                  <InputField
                    onChange={(e) => {
                      setWidgetConfigurationObject({
                        ...widgetConfigurationObject,
                        display: {
                          ...widgetConfigurationObject.display,
                          // eslint-disable-next-line
                          ["fontColor"]: e.target.value,
                        },
                      });
                    }}
                    value={widgetConfigurationObject.display.fontColor}
                    text={"Font Color"}
                    type={"text"}
                    name={"fontColor"}
                    color={widgetConfigurationObject.display.fontColor}
                  />
                  <InputField
                    onChange={(e) => {
                      setWidgetConfigurationObject({
                        ...widgetConfigurationObject,
                        display: {
                          ...widgetConfigurationObject.display,
                          // eslint-disable-next-line
                          ["fontSize"]: e.target.value,
                        },
                      });
                    }}
                    value={widgetConfigurationObject.display.fontSize}
                    text={"Font Size (in px)"}
                    type={"number"}
                    name={"fontSize"}
                  />
                  <InputField
                    onChange={(e) => {
                      setWidgetConfigurationObject({
                        ...widgetConfigurationObject,
                        display: {
                          ...widgetConfigurationObject.display,
                          // eslint-disable-next-line
                          ["primaryColor"]: e.target.value,
                        },
                      });
                    }}
                    value={widgetConfigurationObject.display.chatHeight}
                    text={"Chat Height"}
                    type={"text"}
                    name={"chatHeight"}
                  />
                </div>
                <h2 style={{ marginTop: "1rem", marginBottom: "1rem" }}>
                  Chat Icon
                </h2>
                <div className="second-section-display">
                  <InputField
                    onChange={(e) => {
                      setWidgetConfigurationObject({
                        ...widgetConfigurationObject,
                        display: {
                          ...widgetConfigurationObject.display,
                          // eslint-disable-next-line
                          ["chatIcon"]: e.target.value,
                        },
                      });
                    }}
                    value={widgetConfigurationObject.display.chatIcon}
                    type={"number"}
                    name={"chatIconSize"}
                    text={"Chat Icon Size"}
                  />
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "self-start",
                      width: "100%",
                      gap: "1rem",
                    }}
                  >
                    <label
                      htmlFor="positionOnScreen"
                      style={{ fontSize: "1.2rem", fontWeight: "600" }}
                    >
                      position On Screen
                    </label>
                    <select
                      style={{
                        height: "2rem",
                        width: "100%",
                        borderRadius: "10px",
                        backgroundColor: "white",
                      }}
                      value={widgetConfigurationObject.display.positionOnScreen}
                      onChange={(e) => {
                        setWidgetConfigurationObject({
                          ...widgetConfigurationObject,
                          display: {
                            ...widgetConfigurationObject.display,
                            // eslint-disable-next-line
                            ["positionOnScreen"]: e.target.value,
                          },
                        });
                      }}
                      name="positionOnScreen"
                    >
                      <option value="top-left">Top Left</option>
                      <option value="top-right">Top Right</option>
                      <option value="bottom-left">Bottom Left</option>
                      <option value="bottom-right">Bottom Right</option>
                      <option value="center">Center</option>
                      <option value="custom">Custom</option>
                    </select>{" "}
                  </div>
                  {/* <InputField
                    onChange={(e) => {
                      setWidgetConfigurationObject({
                        ...widgetConfigurationObject,
                        display: {
                          ...widgetConfigurationObject.display,
                          ["positionOnScreen"]: e.target.value,
                        },
                      });
                    }}
                    value={widgetConfigurationObject.display.positionOnScreen}
                    text={"Position On Screen"}
                    type={"text"}
                    name={"positionOnScreen"}
                  /> */}
                  <InputField
                    onChange={(e) => {
                      setWidgetConfigurationObject({
                        ...widgetConfigurationObject,
                        display: {
                          ...widgetConfigurationObject.display,
                          // eslint-disable-next-line
                          ["distanceFromBottom"]: e.target.value,
                        },
                      });
                    }}
                    value={widgetConfigurationObject.display.distanceFromBottom}
                    text={"Distance From Bottom"}
                    type={"number"}
                    name={"distanceFromBottom"}
                  />
                  <InputField
                    onChange={(e) => {
                      setWidgetConfigurationObject({
                        ...widgetConfigurationObject,
                        display: {
                          ...widgetConfigurationObject.display,
                          // eslint-disable-next-line
                          ["horizontalDistance"]: e.target.value,
                        },
                      });
                    }}
                    value={widgetConfigurationObject.display.horizontalDistance}
                    text={"Horizontal Distance"}
                    type={"number"}
                    name={"horizontalDistance"}
                  />
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUplaod}
                      style={{ fontSize: "1rem" }}
                    />
                    <img
                      src={widgetConfigurationObject.display.botIcon}
                      alt="icon"
                      style={{
                        height: "5rem",
                        width: "5rem",
                        borderRadius: "50%",
                      }}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      style={{
                        padding: "10px",
                        borderRadius: "10px",
                        // backgroundColor: "white",
                        width: "70%",
                        height: "3rem",
                        cursor: "pointer",
                        backgroundColor: "#2c3e50",
                        color: "white",
                        fontSize: "1.2rem",
                        textAlign: "center",
                      }}
                      text={"Save"}
                      onClick={handleSaveProject}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {!viewEditTranscript && currentTab === "settings" && <Settings />}
      </div>
      {transcriptSave && (
        <>
          <div className="modal"></div>
          <div className="modal-container">
            <div>Name</div>
            <input
              type="text"
              style={{
                width: "100%",
                height: "3rem",
                borderRadius: "10px",
                boxShadow: "1px 1px 1px 1px gray",
                border: "1px",
              }}
              onChange={(e) => {
                setFileDetails({
                  ...fileDetails,
                  // eslint-disable-next-line
                  ["name"]: e.target.value,
                });
              }}
            />
            <div>Description</div>
            <textarea
              type="text"
              style={{
                width: "100%",
                // height: "2rem",
                borderRadius: "10px",
                borderColor: "black",
                resize: "none",
                height: "7rem",
              }}
              onChange={(e) => {
                setFileDetails({
                  ...fileDetails,
                  // eslint-disable-next-line
                  ["description"]: e.target.value,
                });
              }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                width: "100%",
                gap: "1rem",
              }}
            >
              <Button
                style={{
                  padding: "10px",
                  borderRadius: "10px",
                  border: "none",
                  boxShadow: "2px 2px 2px 2px #C8C8C8",
                  cursor: "pointer",
                }}
                text={"cancel"}
                onClick={() => setTranscriptSave(!transcriptSave)}
              />
              <Button
                style={{
                  padding: "10px",
                  background: "#211935",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  boxShadow: "2px 2px 2px 2px #C8C8C8",
                  cursor: "pointer",
                }}
                text={"Save"}
                onClick={() => {
                  setTranscriptSave(!transcriptSave);
                  handleUploadDescription();
                }}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Project;
