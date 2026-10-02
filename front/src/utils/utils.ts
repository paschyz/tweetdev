export const API_BASE_URL = process.env.API_BASE_URL as string;
export const FRONT_BASE_URL = process.env.FRONT_BASE_URL as string;
export const API2_BASE_URL = "http://localhost:3000";
export const convertTimestampToMonthYear =(timestamp: string): string =>{
    const date = new Date(timestamp);
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day:"2-digit" };
    return date.toLocaleDateString('en-US', options);
}

  export const convertTimeToPostTime = (time: string): string => {
    const date = new Date(time);
    const today = new Date();
  
    const timeDifference = today.getTime() - date.getTime();
  
    const hoursDifference = timeDifference / (1000 * 60 * 60);
  
    if (hoursDifference > 24) {
      return convertTimestampToMonthYear(time);
    } else {
      const hours = Math.floor(hoursDifference);
      const minutes = Math.floor((timeDifference / (1000 * 60)) % 60);
  
      if (hours > 0) {
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
      } else if (minutes > 0) {
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
      } else {
        return `just now`;
      }
    }
  };
  
  export const navigateTo = (location: string) => {
    window.location.href = location;
  };

  export const navigateToNewWindow = (location: string) => {
    window.open(location, '_blank');
  };
  


  export const defaultUser: UserResponse = {
    description: "",
      followers: [],
      following:[],
      profileImageUrl: "",
      backgroundImageUrl:"",
      joinDate: "",
      login: "",
      password: "",
      posts: [],
      roles: [],
      username: "",
      _id: ""
    };
  
