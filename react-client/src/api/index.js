import axios from "axios";

const publicAxiosClient = axios.create({
  baseURL: "http://localhost:3002",
  withCredentials: true,
});

export const privateAxiosClient = axios.create({
  baseURL: "http://localhost:3002",
});

export function loginAPI(value) {
  return publicAxiosClient.post("/login", value);
}

export const logoutAPI = () => publicAxiosClient.post("/logout", {});

export const refreshTokenAPI = () =>
  publicAxiosClient.post("/refresh-access-token", {});

export const getNotes1API = () => privateAxiosClient.get("/notes1");

export const getNotes2API = () => privateAxiosClient.get("/notes2");

export const getNotes3API = () => privateAxiosClient.get("/notes3");

export const createNotes1API = (value) =>
  privateAxiosClient.post("/notes1", { value });

export const createNotes2API = (value) =>
  privateAxiosClient.post("/notes2", { value });

export const createNotes3API = (value) =>
  privateAxiosClient.post("/notes3", { value });
