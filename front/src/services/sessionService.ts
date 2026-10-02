import { fetchSelfInfo } from "../api/user";

const SESSION_STORAGE_KEY = 'authToken';

export const setSession = (token:string) => {
  localStorage.setItem(SESSION_STORAGE_KEY, token);
};

export const getSession = (): string => {
  const token = localStorage.getItem(SESSION_STORAGE_KEY);
  return token as string;
};


export const clearSession = () => {
  localStorage.removeItem(SESSION_STORAGE_KEY);
};

export function hasAuthToken(): boolean {
  const token = getSession();
  return token !== null && token !== undefined;
}

const setEachPropertyToLocalStorage = (object: { [x: string]: any; }) => {
  for (const property in object) {
    localStorage.setItem(property, JSON.stringify(object[property]));
  }
};

export const setUserInfoToLocalStorage = async (token: string) => {
  const user = await fetchSelfInfo(token);
  setEachPropertyToLocalStorage(user);
} 


export const getLocalStorageItemByName= (name:string) =>{
  const item = localStorage.getItem(name);
  return item ? JSON.parse(item) : "";
}