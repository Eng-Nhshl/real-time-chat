import api, { setToken, clearToken } from "./api";

const login = async (email, password) => {
  const response = await api.post("/api/user/login", { email, password });
  return response.data;
};

const signup = async (fullName, email, password, bio) => {
  const response = await api.post("/api/user/signup", {
    fullName,
    email,
    password,
    bio,
  });
  return response.data;
};

const getProfile = async () => {
  const response = await api.get("/api/user/profile");
  return response.data;
};

const updateProfile = async (data) => {
  const response = await api.put("/api/user/profile", data);
  return response.data;
};

export default {
  login,
  signup,
  getProfile,
  updateProfile,
  setToken,
  clearToken,
};
