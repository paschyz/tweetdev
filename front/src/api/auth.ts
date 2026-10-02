import axios from "axios";
import { API_BASE_URL } from "../utils/utils";


export const login = async (formData: { login: string; password: string }): Promise<any> => {
  try {
    console.log("API_BASE_URL: ", API_BASE_URL)
    const response = await axios.post(`${API_BASE_URL}/auth/login`, formData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const token = response.data.token;
    return token;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/auth/logout`);
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
};


export const subscribe = async (formData: { login: string; password: string, username:string, profileImageUrl:string, backgroundImageUrl:string, description:string, joinDate:Date }): Promise<any> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/user/subscribe`, formData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error creating user (subscribe):", error);
    throw error;
  }
};