import axios from "axios";
import { API_BASE_URL } from "../utils/utils";


export const getIsCommentDeletable = async (token: string, id: string): Promise<any> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/comments/is-deletable?id=${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching program:", error);
      throw error;
    }
  };

  export const fetchGetIsCommentDeletable = async (token: string, id: string) => {
    try {
      const data = await getIsCommentDeletable(token, id);
      return data;
    } catch (error) {
      console.error("Error fetching program:", error);
      throw error;
    }
  };


  export const deleteComment = async (token: string,id:string,): Promise<any> => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/comments/?id=${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting workflow:", error);
      throw error;
    }
  };


  export const createComment = async (token: string,formData: any): Promise<any> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/comments/`, formData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error creating comment :", error);
      throw error;
    }
  };
