import { endpoints } from "@/lib/axios";
import axios from "axios";

export const createGist = async (payload: any) => {
  const response = await axios.post(endpoints.gist, payload);
  return response.data;
};
