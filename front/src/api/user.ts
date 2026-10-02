import axios from "axios";
import { API_BASE_URL } from "../utils/utils";


export const getSelfInfo = async (token: string): Promise<any> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user/me`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching self info:", error);
    throw error;
  }
};

export const fetchSelfInfo = async (token: string) => {
  try {
    const userData = await getSelfInfo(token);
    return userData;
  } catch (error) {
    console.error("Error fetching self info:", error);
    throw error;
  }
};

export const getUserInfo = async (token: string, userId:string): Promise<any> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user/one`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      params: {
        id: userId
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching self info:", error);
    throw error;
  }
};

export const fetchUserInfo = async (token: string, userId:string) => {
  try {
    const userData = await getUserInfo(token, userId);
    return userData;
  } catch (error) {
    console.error("Error fetching user info:", error);
    throw error;
  }
};



export const getUserInfoByUsername = async (token: string, username:string): Promise<any> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user/one-by-username`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      params: {
        username: username
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching self info:", error);
    throw error;
  }
};

export const fetchUserInfoByUsername = async (token: string, username:string) => {
  try {
    const userData = await getUserInfoByUsername(token, username);
    return userData;
  } catch (error) {
    console.error("Error fetching user info:", error);
    throw error;
  }
};


export const fetchUserProfilePictureByUsername = async (token: string, username:string) => {
  try {
    const userData = await getUserInfoByUsername(token, username);
    return userData.profileImageUrl;
  } catch (error) {
    console.error("Error fetching user info:", error);
    throw error;
  }
};

export const updateUser = async (token: string, userInfo: any): Promise<any> => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/user/`,
      userInfo, 
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating user info:", error);
    throw error;
  }
};
export const updatePassword = async (token: string, userInfo: any): Promise<any> => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/user/password`,
      userInfo, 
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating user password:", error);
    throw error;
  }
};

export const followUser = async (token: string, username:string): Promise<any> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/user/follows`,
      {"username":username}, 
       {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error following:", error);
    throw error;
  }
};

export const getIsUserFollowed = async (token: string, username: string): Promise<any> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user/is-liked`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      params: {
        username: username
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

export const fetchIsUserFollowed = async (token: string, id: string) => {
  try {
    const response = await getIsUserFollowed(token, id);
    return response;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

export const getFollowers = async (token: string, username: string): Promise<any> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user/follow`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      params: {
        username: username
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};


export const getUserHubs = async (token: string): Promise<any> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user/hubs`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching self hubs:", error);
    throw error;
  }
};

export const fetchUserHubs = async (token: string) => {
  try {
    const userData = await getUserHubs(token);
    return userData;
  } catch (error) {
    console.error("Error fetching user hubs:", error);
    throw error;
  }
};

export const getFollowing = async (token: string): Promise<any> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user/following`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching self hubs:", error);
    throw error;
  }
};

export const fetchGetFollowing = async (token: string) => {
  try {
    const userData = await getFollowing(token);
    return userData;
  } catch (error) {
    console.error("Error fetching user hubs:", error);
    throw error;
  }
};

export const deleteSelf = async (token: string): Promise<any> => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/user/me`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting self :", error);
    throw error;
  }
};


export const getFollowUsers = async (token: string,username:string): Promise<any> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user/follow-info?username=${username}`, {

      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching self hubs:", error);
    throw error;
  }
};

export const fetchGetFollowUsers = async (token: string,username: string) => {
  try {
    const userData = await getFollowUsers(token,username);
    return userData;
  } catch (error) {
    console.error("Error fetching user hubs:", error);
    throw error;
  }
};