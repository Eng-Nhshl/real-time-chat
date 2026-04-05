import api from "./api";

const getMessages = async (userId) => {
  const response = await api.get(`/api/messages/${userId}`);
  return response.data;
};

const sendMessage = async (receiverId, payload) => {
  const response = await api.post(`/api/messages/send/${receiverId}`, payload);
  return response.data;
};

export default {
  getMessages,
  sendMessage,
};
