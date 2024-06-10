import axios from "axios";

export const instance = axios.create({
  baseURL: "https://skailama-backend-pvwx.onrender.com",
  withcredentials: true,
  headers: {
    "content-type": "application/json",
  },
});
