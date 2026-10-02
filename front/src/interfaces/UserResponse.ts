interface UserResponse {
  description: string;
    followers: string[];
    following:string[];
    profileImageUrl: string;
    backgroundImageUrl : string;
    joinDate: string; 
    login: string;
    password: string;
    posts: string[]; 
    roles: Role[];
    username: string;
    _id: string;
  }
  