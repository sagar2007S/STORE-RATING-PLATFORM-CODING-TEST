import api from "./axios.js";

export const loginUser = (credentials) => api.post("/auth/login", credentials);
export const signupUser = (data) => api.post("/auth/signup", data);
export const changePassword = (data) => api.post("/auth/change-password", data);
