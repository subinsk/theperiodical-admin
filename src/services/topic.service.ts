import { api, endpoints } from "@/lib/axios";

export const addTopic = async (payload: any) => {
  const response = await api.post(endpoints.topic, payload);
  return response.data;
};

export const updateTopic = async (id: string, payload: any) => {
  const response = await api.put(`${endpoints.topic}/${id}`, payload);
  return response.data;
};

export const deleteTopic = async (id: string) => {
  const response = await api.delete(`${endpoints.topic}/${id}`);
  return response.data;
};
