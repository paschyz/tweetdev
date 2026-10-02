import axios from "axios";

import { API2_BASE_URL, API_BASE_URL } from "../utils/utils";

export const fetchPrograms = async (token: string): Promise<any> => {
    try {
        let hubsData = await getPrograms(token);
        return hubsData;
    } catch (error) {
        console.error("Error fetching programs:", error);
        throw error;
    }
  };

  export const getPrograms  = async (token: string): Promise<any> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/program`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data.reverse();
    } catch (error) {
      console.error("Error fetching programs:", error);
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
  

  export const createProgram = async (token: string,formData:any): Promise<any> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/program/`, formData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error creating program :", error);
      throw error;
    }
  };

  export const getIsProgramDeletable = async (token: string, id: string): Promise<any> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/program/is-deletable?id=${id}`, {
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

  export const fetchIsPostDeletable = async (token: string, id: string) => {
    try {
      const data = await getIsProgramDeletable(token, id);
      return data;
    } catch (error) {
      console.error("Error fetching program:", error);
      throw error;
    }
  };

  export const deleteProgram = async (token: string,id:string): Promise<any> => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/program/?id=${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting program:", error);
      throw error;
    }
  };
  
  export const getProgramById = async (token: string, id: string): Promise<any> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/program/one`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        params:{ id:id} 
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching program:", error);
      throw error;
    }
  };
  export const fetchProgramById = async (token: string, id: string) => {
    try {
      const programData = await getProgramById(token,id);
    
      return programData;} catch (error) {
        
      console.error("Error fetching program:", error);
      throw error;
    }
  };  

      export const executeProgram = async (token: string, formData: FormData): Promise<any> => {
        try {
          const outputFileType = formData.get("outputFileType"); // Renvoie 'py'

            const response = await axios.post(`${API2_BASE_URL}/program/execute`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                },
                responseType: outputFileType === "void" ? 'text' : 'blob' // Utiliser 'blob' uniquement si outputFileType n'est pas void
              });
            return response.data;
        } catch (error) {
            console.error("Error executing program:", error);
            throw error;
        }
    };
  export const fetchExecuteProgram = async (token: string, body: any) => {
    try {
      const programData = await executeProgram(token,body);
    
      return programData;} catch (error) {
        
      console.error("Error executing program:", error);
      throw error;
    }
  };  

  export const executePipeline = async (token: string, formData: FormData): Promise<any> => {
    try {
      const outputFileType = formData.get("outputFileType"); // Renvoie 'py'

        const response = await axios.post(`${API2_BASE_URL}/program/execute`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            },
            responseType: outputFileType === "void" ? 'text' : 'blob' // Utiliser 'blob' uniquement si outputFileType n'est pas void
          });
        return response.data;
    } catch (error) {
        console.error("Error executing program:", error);
        throw error;
    }
};

  export const updateProgram = async (token: string,id:string, programInfo: any,): Promise<any> => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/program/?id=${id}`,
        programInfo, 
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating program info:", error);
      throw error;
    }
  };


  export const getUserPrograms = async (token: string, username?: string): Promise<any> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/program/user`, {
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
  export const fetchGetUserPrograms = async (token: string, username?: string) => {
    try {
      const postsData = await getUserPrograms(token, username);
      return postsData;
    } catch (error) {
      console.error("Error fetching posts:", error);
      throw error;
    }
  };

//   export const deleteHubByName = async (token: string,name:string): Promise<any> => {
//     try {
//       const response = await axios.delete(`${API_BASE_URL}/hub/delete?name=${name}`, {

//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         }
//       });
//       return response.data;
//     } catch (error) {
//       console.error("Error creating hub :", error);
//       throw error;
//     }
//   };

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

//   export const updateHub = async (token: string,name:string, hubInfo: any,): Promise<any> => {
//     try {
//       const response = await axios.patch(
//         `${API_BASE_URL}/hub/update?name=${name}`,
//         hubInfo, 
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`
//           }
//         }
//       );
//       return response.data;
//     } catch (error) {
//       console.error("Error updating hub info:", error);
//       throw error;
//     }
//   };
  