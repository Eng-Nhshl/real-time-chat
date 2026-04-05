import api from "./api";

const getUsers = async () => {
  const response = await api.get("/api/user");
  return response.data;
};

export default { getUsers };
