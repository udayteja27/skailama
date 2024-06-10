import { instance } from ".";

export const createUser = async (payload) => {
  try {
    const response = await instance.post("/user/create-user", payload);
    return response.data;
  } catch (error) {
    return error.message;
  }
};

export const createProject = async (payload) => {
  try {
    const response = await instance.post("/user/create-project", payload);
    return response.data;
  } catch (error) {
    return error.message;
  }
};
export const getAllProjects = async (payload) => {
  try {
    const response = await instance.post("/user/get-all-projects", payload);
    return response.data;
  } catch (error) {
    return error.message;
  }
};

export const getProject = async (payload) => {
  try {
    const response = await instance.post("/user/get-project", payload);
    return response.data;
  } catch (error) {
    return error.message;
  }
};
export const addProjectDetails = async (payload) => {
  try {
    const response = await instance.post("/user/add-project-detials", payload);
    return response.data;
  } catch (error) {
    return error.message;
  }
};
export const saveProject = async (payload) => {
  try {
    const response = await instance.post("/user/save-project", payload);
    return response.data;
  } catch (error) {
    return error.message;
  }
};

export const deleteTranscript = async (payload) => {
  try {
    const response = await instance.delete(
      `/user/delete-transcript?projectId=${payload.projectId}&fileId=${payload.transcriptId}`,
      payload
    );
    return response.data;
  } catch (error) {
    return error.message;
  }
};
export const saveEdittedFile = async (payload) => {
  try {
    const response = await instance.patch(`/user/editted-transcript`, payload);
    return response.data;
  } catch (error) {
    return error.message;
  }
};
export const getImageUrl = async () => {
  try {
    const response = await instance.get(`/s3-url`);
    return response.data;
  } catch (error) {
    return error.message;
  }
};

export const getUserData = async (payload) => {
  try {
    const response = await instance.post("/user/get-user", payload);
    return response.data;
  } catch (error) {
    return error.message;
  }
};
