import axios from "axios";

import { API_BASE_URL } from "../utils/utils";


export const fetchWorkflows = async (token: string): Promise<any> => {
    try {
        let hubsData = await getWorkflows(token);
        return hubsData;
    } catch (error) {
        console.error("Error fetching Workflows:", error);
        throw error;
    }
  };

  export const getWorkflows  = async (token: string): Promise<any> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/workflow`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data.reverse();
    } catch (error) {
      console.error("Error fetching Workflows:", error);
      throw error;
    }
  };
  
//   export const getHubByName = async (token: string, name:string): Promise<any> => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/hub/by-name?name=${name}`, {

//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         }
//       });
//       return response.data;
//     } catch (error) {
//       console.error("Error fetching hubs:", error);
//       throw error;
//     }
//   };

  
//   export const fetchHubByName = async (token: string, name:string): Promise<any> => {
//     try {
//         let hubsData = await getHubByName(token, name);
//         return hubsData;
//     } catch (error) {
//         console.error("Error fetching hubs:", error);
//         throw error;
//     }
//   };

//   export const getHubPosts = async (token: string, name:string): Promise<any> => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/hub/posts?name=${name}`, {

//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         }
//       });
//       return response.data;
//     } catch (error) {
//       console.error("Error fetching hubs:", error);
//       throw error;
//     }
//   };

  
//   export const fetchHubPosts = async (token: string, name:string): Promise<any> => {
//     try {
//         let hubsData = await getHubPosts(token, name);  
//         return hubsData;
//     } catch (error) {
//         console.error("Error fetching hubs:", error);
//         throw error;
//     }
//   };

//   export const getIsHubFollowedBySelf = async (token: string, name:string): Promise<any> => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/hub/is-followed?name=${name}`, {

//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         }
//       });
//       return response.data;
//     } catch (error) {
//       console.error("Error fetching hubs:", error);
//       throw error;
//     }
//   };

  
//   export const fetchIsHubFollowedBySelf = async (token: string, name:string): Promise<any> => {
//     try {
//         let hubsData = await getIsHubFollowedBySelf(token, name);  
//         return hubsData;
//     } catch (error) {
//         console.error("Error fetching hubs:", error);
//         throw error;
//     }
//   };

//   export const toggleFollowHub = async (token: string, name:string): Promise<any> => {
//     try {
//       const response = await axios.put(`${API_BASE_URL}/hub/follow?name=${name}`,  
//         {},  
//          {
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         }
//       });
//       return response.data;
//     } catch (error) {
//       console.error("Error following:", error);
//       throw error;
//     }
//   };
export const getUserWorkflows = async (token: string, username?: string): Promise<any> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/workflow/user`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      params: username ? { username } : {}
    });
    return response.data.reverse();
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
};
export const fetchGetUserWorkflows = async (token: string, username?: string) => {
  try {
    const postsData = await getUserWorkflows(token, username);
    return postsData;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
};


  export const createWorkflow = async (token: string,formData: any): Promise<any> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/workflow/`, formData, {
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

  
  
  export const cloningWorkflow = async (token: string,formData: any): Promise<any> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/workflow/clone`, formData, {
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

  export const deleteWorkflowVersionByIdandName = async (token: string,id:string,versionName:string): Promise<any> => {
    try {
      const response = await axios.patch(`${API_BASE_URL}/workflow/delete/version/?id=${id}`, 
        versionName,{
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error deleting version :", error);
      throw error;
    }
  };

  export const getIsWorkflowDeletable = async (token: string, id: string): Promise<any> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/workflow/is-deletable?id=${id}`, {
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

  export const fetchIsWorkflowDeletable = async (token: string, id: string) => {
    try {
      const data = await getIsWorkflowDeletable(token, id);
      return data;
    } catch (error) {
      console.error("Error fetching program:", error);
      throw error;
    }
  };


//   export const getIsAdminHub = async (token: string, name:string): Promise<any> => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/hub/is-admin?name=${name}`, {

//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         }
//       });
//       return response.data;
//     } catch (error) {
//       console.error("Error fetching hubs:", error);
//       throw error;
//     }
//   };

  
//   export const fetchIsAdminHub = async (token: string, name:string): Promise<any> => {
//     try {
//         let hubsData = await getIsAdminHub(token, name);
//         return hubsData;
//     } catch (error) {
//         console.error("Error fetching hubs:", error);
//         throw error;
//     }
//   };

  export const updateWorkflow = async (token: string,id:string, workflowInfo: any,): Promise<any> => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/workflow/?id=${id}`,
        workflowInfo, 
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating hub info:", error);
      throw error;
    }
  };

  export const updateWorkflowName = async (token: string,id:string, workflowInfo: any,): Promise<any> => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/workflow/name/?id=${id}`,
        workflowInfo, 
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating hub info:", error);
      throw error;
    }
  };
  
  
  export const upgradeWorkflow = async (token: string,id:string, workflowInfo: any,): Promise<any> => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/workflow/upgrade/?id=${id}`,
        workflowInfo, 
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating hub info:", error);
      throw error;
    }
  };
    
  export const deleteWorkflow = async (token: string,id:string,): Promise<any> => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/workflow/?id=${id}`,
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
  
  export const getWorkflowById = async (token: string, id: string): Promise<any> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/workflow/one`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        params:{ id:id} 
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching workflow:", error);
      throw error;
    }
  };
  export const fetchWorkflowById = async (token: string, id: string) => {
    try {
      const workflowData = await getWorkflowById(token,id);
      return workflowData
    } catch (error) {
      console.error("Error fetching workflow:", error);
      throw error;
    }
  };