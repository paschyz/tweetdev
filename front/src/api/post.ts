import axios from "axios";
import { API_BASE_URL } from "../utils/utils";


export const getPosts = async (token: string): Promise<any> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/post/all`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data.reverse();
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
};

export const getFollowedUsersPosts = async (token: string): Promise<any> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/post/followed-users-posts`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
};


export const fetchPosts = async (token: string, fetchAllPosts: boolean): Promise<any> => {
  try {
      let postsData;
      if (fetchAllPosts) {
          postsData = await getPosts(token);
      } else {
          postsData = await getFollowedUsersPosts(token);
      }
      return postsData;
  } catch (error) {
      console.error("Error fetching posts:", error);
      throw error;
  }
};
  export const getProfilePosts = async (token: string, username?: string): Promise<any> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/post/user-posts`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        params: username ? { username } : {}
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching posts:", error);
      throw error;
    }
  };
  export const fetchProfilePosts = async (token: string, username?: string) => {
    try {
      const postsData = await getProfilePosts(token, username);
      return postsData;
    } catch (error) {
      console.error("Error fetching posts:", error);
      throw error;
    }
  };

  export const getPostById = async (token: string, id: string): Promise<any> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/post`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        params:{ id:id} 
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching posts:", error);
      throw error;
    }
  };
  export const fetchPostById = async (token: string, id: string) => {
    try {
      const postsData = await getPostById(token, id);
      return postsData;
    } catch (error) {
      console.error("Error fetching posts:", error);
      throw error;
    }
  };

  export const getComments = async (token: string, id: string): Promise<any> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/post/comments`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        params:{ id:id} 
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching posts:", error);
      throw error;
    }
  };
  export const fetchGetComments = async (token: string, id: string) => {
    try {
      const postsData = await getComments(token, id);
      return postsData;
    } catch (error) {
      console.error("Error fetching posts:", error);
      throw error;
    }
  };

  export const getIsPostLiked = async (token: string, postId: string): Promise<any> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/post/is-liked`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        params: {
          post_id: postId
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching posts:", error);
      throw error;
    }
  };

  export const fetchIsPostLiked = async (token: string, postId: string) => {
    try {
      const postsData = await getIsPostLiked(token, postId);
      return postsData;
    } catch (error) {
      console.error("Error fetching posts:", error);
      throw error;
    }
  };


  export const patchToggleLikePost = async (token: string, likeInfo: any): Promise<any> => {
    try {
      const response = await axios.patch(`${API_BASE_URL}/post/like`,
        likeInfo,
        {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching posts:", error);
      throw error;
    }
  };
  export const createPost = async (token: string,formData: {  content:string, hubname?:string, program?:string }): Promise<any> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/post`, formData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error creating post :", error);
      throw error;
    }
  };

  export const deletePostById = async (token: string,postId:string): Promise<any> => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/post?id=${postId}`, {

        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error creating hub :", error);
      throw error;
    }
  };

  export const getIsPostDeletable = async (token: string, postId: string): Promise<any> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/post/is-deletable?id=${postId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching posts:", error);
      throw error;
    }
  };

  export const fetchIsPostDeletable = async (token: string, postId: string) => {
    try {
      const postsData = await getIsPostDeletable(token, postId);
      return postsData;
    } catch (error) {
      console.error("Error fetching posts:", error);
      throw error;
    }
  };
