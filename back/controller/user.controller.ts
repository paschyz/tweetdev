import { Document, Model } from "mongoose"
import { CommentModel, HubModel, PostModel, ProgramModel, Role, RoleModel, SessionModel, User, UserModel, WorkflowModel } from "../models"
import { Router, Response, Request} from "express"
import * as express from 'express'
import { SecurityUtils } from "../utils"
import { checkBody, checkUserRole, checkUserToken } from "../middleware"
import { RolesEnums } from "../enums"
import { checkQuery } from "../middleware/query.middleware"


export class UserController {

    readonly path: string
    readonly model: Model<User>
    guestRole: Role | null

    constructor(){
        this.path = "/user"
        this.model = UserModel
        this.guestRole = null
    }

    private loadGuestRole = async ():Promise<void> => {
        if (this.guestRole) {
            return
        }
        this.guestRole = await RoleModel.findOne({
            name: "guest"
        }).exec()
    }

    readonly paramsLogin = {
        "login" : "string",
        "password" : "string",
        "username" : "string",
        "profileImageUrl" : "string",
        "description" : "string",
        "joinDate" : "string",
    }

    subscribe = async (req: Request, res: Response): Promise<void> => {
        console.log("subscribe launched")
        const login: string = req.body.login;
        const password: string = req.body.password;
      
        try {
          await this.loadGuestRole();
      
          const user = await UserModel.create({
            login,
            password: SecurityUtils.toSHA512(password),
            username: req.body.username,
            roles: [this.guestRole],
            profileImageUrl: req.body.profileImageUrl,
            backgroundImageUrl: req.body.backgroundImageUrl,
            description: req.body.description,
            joinDate: req.body.joinDate,
            followers: [],
            following: []
          });
      
          res.json(user);
      
        } catch (err: any) {
            if (err.name === 'MongoServerError' && err.code === 11000) {
              const duplicatedField = Object.keys(err.keyValue)[0]; 
              const errorMessage = duplicatedField === 'login'
                ? 'The login is already in use.'
                : duplicatedField === 'username'
                ? 'The username is already in use.'
                : 'A unique field is already in use.';
              
            res.status(409).json({ message: errorMessage });
          } else {
            console.log(err);
            res.status(500).end();
          }
        }
      };

    readonly paramsUpdateUser = {
        "password" : "string | undefined",
        "profileImageUrl": "string | undefined",
        "backgroundImageUrl": "string | undefined",
        "description" : "string | undefined",
    }


    updateUsernameInPosts = async (oldUsername:string, newUsername:string) => {
        try {
          const result = await PostModel.updateMany(
            { username: oldUsername }, 
            { username: newUsername } 
          );
      
          console.log('Number of documents matched username:', result.matchedCount);
          console.log('Number of documents modified username:', result.modifiedCount);
        } catch (error) {
          console.error('Error updating posts:', error);
        }
      }

    updateUsernameInFollowers = async (oldUsername:string, newUsername:string) => {
        try {
          const result = await UserModel.updateMany(
            { followers: oldUsername }, 
            { $set: { "followers.$": newUsername } }
          );
      
          console.log('Number of documents matched followers:', result.matchedCount);
          console.log('Number of documents modified followers:', result.modifiedCount);
        } catch (error) {
          console.error('Error updating followers:', error);
        }
      };

      updateUsernameInFollowing = async (oldUsername:string, newUsername:string) => {
        try {
          const result = await UserModel.updateMany(
            { following: oldUsername }, 
            { $set: { "following.$": newUsername } }
          );
      
          console.log('Number of documents matched following:', result.matchedCount);
          console.log('Number of documents modified following:', result.modifiedCount);
        } catch (error) {
          console.error('Error updating following:', error);
        }
      };
      updateUsernameInHubUsers = async (oldUsername:string, newUsername:string) => {
        try {
          const result = await HubModel.updateMany(
            { users: oldUsername }, 
            { $set: { "users.$": newUsername } }
          );
      
          console.log('Number of documents matched hub users:', result.matchedCount);
          console.log('Number of documents modified hub users:', result.modifiedCount);
        } catch (error) {
          console.error('Error updating hub users:', error);
        }
      };
      updateUsernameInHubAdmins = async (oldUsername:string, newUsername:string) => {
        try {
          const result = await HubModel.updateMany(
            { admins: oldUsername }, 
            { $set: { "admins.$": newUsername } }
          );
      
          console.log('Number of documents matched hub admins:', result.matchedCount);
          console.log('Number of documents modified hub admins:', result.modifiedCount);
        } catch (error) {
          console.error('Error updating hub admins:', error);
        }
      };

      updateUsernameInPostLikes = async (oldUsername:string, newUsername:string) => {
        try {
          const result = await PostModel.updateMany(
            { "like.username": oldUsername }, 
            { $set: { "like.$.username": newUsername } }
          );
      
          console.log('Number of documents matched hub likes:', result.matchedCount);
          console.log('Number of documents modified hub likes:', result.modifiedCount);
        } catch (error) {
          console.error('Error updating hub likes:', error);
        }   
      };

    
      updateUsernameInProgramsLikes = async (oldUsername:string, newUsername:string) => {
        try {
          const result = await ProgramModel.updateMany(
            { "like.username": oldUsername }, 
            { $set: { "like.$.username": newUsername } }
          );
      
          console.log('Number of documents matched programs likes:', result.matchedCount);
          console.log('Number of documents modified programs likes:', result.modifiedCount);
        } catch (error) {
          console.error('Error updating programs likes:', error);
        }   
      };

      updateUsernameInPrograms = async (oldUsername:string, newUsername:string) => {
        try {
          const result = await ProgramModel.updateMany(
            { username: oldUsername }, 
            { username: newUsername } 
          );
      
          console.log('Number of documents matched username:', result.matchedCount);
          console.log('Number of documents modified username:', result.modifiedCount);
        } catch (error) {
          console.error('Error updating programs:', error);
        }
      }
      updateUsernameInWorkflows = async (oldUsername:string, newUsername:string) => {
        try {
          const result = await WorkflowModel.updateMany(
            { username: oldUsername }, 
            { username: newUsername } 
          );
      
          console.log('Number of documents matched username:', result.matchedCount);
          console.log('Number of documents modified username:', result.modifiedCount);
        } catch (error) {
          console.error('Error updating programs:', error);
        }
      }

      updateUsernameInComments = async (oldUsername:string, newUsername:string) => {
        try {
          const result = await CommentModel.updateMany(
            { username: oldUsername }, 
            { username: newUsername } 
          );
      
          console.log('Number of documents matched username:', result.matchedCount);
          console.log('Number of documents modified username:', result.modifiedCount);
        } catch (error) {
          console.error('Error updating comments:', error);
        }
      }


    updateUser = async (req: Request, res: Response) => {
        const { currentPassword, password, ...userInfo } = req.body;
      
        try {
          const user = await UserModel.findOne({username:req.user?.username});
            const last_username = req.user?.username || "";
          if (!user) {
            res.status(404).end();  
            return;
          }
          

        //   if (currentPassword) {
        //     const isCurrentPasswordValid = SecurityUtils.verifySHA512(
        //       currentPassword,
        //       user.password
        //     );
      
        //     if (!isCurrentPasswordValid) {
        //       res.status(400).json({ message: "Current password is incorrect" });
        //       return;
        //     }
        //   }
      
          let updated_user;
      
          const updateData: any = {
            // ...(password && { password: SecurityUtils.toSHA512(password) }),
            ...userInfo,
          };

          try {
            updated_user = await UserModel.findOneAndUpdate(
                {username:req.user?.username},
              updateData,
              { new: true }
            );
            
            if (!updated_user) {
              res.status(404).end();
              return;
            }
            if(updateData.username){
                this.updateUsernameInPosts( last_username,updateData.username)
                this.updateUsernameInFollowers( last_username,updateData.username)
                this.updateUsernameInFollowing( last_username,updateData.username)
                this.updateUsernameInHubUsers( last_username,updateData.username)
                this.updateUsernameInHubAdmins( last_username,updateData.username)
                this.updateUsernameInPostLikes ( last_username,updateData.username)
                this.updateUsernameInPrograms(last_username,updateData.username)
                this.updateUsernameInProgramsLikes(last_username,updateData.username)
                this.updateUsernameInWorkflows(last_username,updateData.username)
                this.updateUsernameInComments(last_username,updateData.username)
            }
          } catch (e) {
            console.log(e);
            res.status(500).json({ message: "We were unable to update the user." });
            return;
          }
      
          res.status(200).json(updated_user);
          return;
        } catch (e) {
          console.log(e);
          res.status(500).json({ message: "We were unable to find the user." });
          return;
        }
      };
      

    

    me = async (req:Request, res: Response) => {
        if (req.user){
            req.user.password = "";
        }
        res.json(req.user)
    }

    getAllUsersInfo = async (req:Request, res:Response): Promise<void> => {
        const return_list: (Document<unknown, {}, User> & User & Required<{ _id: string }>)[] = []

        const users = await UserModel.find({"_id": {"$ne": req.user?._id}})
        if(!users){
            res.status(404).json({"message" : "No users"})
            return
        }
        users.forEach(user => {
            user.password = ""
            user.roles = []
            return_list.push(user)
        })

        res.status(200).json(return_list)
        return 
    }

    readonly paramsGiveRole = {
        "user_id" : "string",
        "role" : "string"
    }

    addRole = async (req:Request, res:Response): Promise<void> => {

        if(!req.user){res.send(401).end(); return}

        if ( req.body.user_id === String(req.user._id)){
            res.status(409).json({"message" : "You can't assign roles to yourself"})
            return
        }

        try{
            const role = await RoleModel.findById(req.body.role)
            const user = await UserModel.findById(req.body.user_id)
            if(!role || !user){res.status(404).json({"message" : "Role or User not found"}); return}
            if(!user.roles.some(userRole => String(role._id) === String(userRole._id))){
                user.roles.push(role)
                user.save()
                res.status(200).json({"message" : "Role assign"})
                return 
            }
        
            res.status(409).json({"message" : "The user already has the role"})
            return

        }catch(err){
            res.status(400).json({"message" : "One of the ID is incorrect"})
            return
        }
    }

    getRoles = async (req: Request, res: Response): Promise<void> => {

        const roles = await RoleModel.find({})

        res.send(roles)
    }

    getAllUsers = async (req:Request, res: Response): Promise<void> => {
        const users = (await UserModel.find({})).length

        res.status(200).json(users)
    }

    getOneUser = async (req: Request, res: Response): Promise<void> => {
        if(!req.query.id || typeof req.query.id !== "string"){
            res.status(400).end()
            return
        }

        let user
        try{
            user = await UserModel.findById(req.query.id).populate("roles")
            if(user){
                user.password = ""
                user.roles = []
            }
        }catch(e){
            res.status(404).json("User not found")
        }

        res.status(200).json(user)
    }
  
    getOneUserByUsername = async (req: Request, res: Response): Promise<void> => {
        const username = req.query.username as string;
    
        try {
            const user = await UserModel.findOne({ username });
    
            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            }
    
            user.password = '';
            user.roles = [];
    
            res.status(200).json(user);
        } catch (error) {
            console.error('Error retrieving user:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };
  


    readonly queryGetPost = {
        "username" : "string | undefined"
    }

    getAllPost = async (req:Request, res:Response): Promise<void> => {

        if (!req.query.username && req.user){
            res.status(200).json(await PostModel.find({ username:req.user.username}));
            return
        }

        try{
            const user = await UserModel.find({ username:req.query.username});
            if (!user){
                res.status(404).json({'message': "User not found"})
                return 
            }
            res.status(200).json(await PostModel.find({ username:req.query.username}));
            return 
        }catch(err){
            res.status(500).json({'message': "Server error"})
            return 
        }
    
    }


  
    readonly queryValidatePost = {
        "post_id" : "string"
    }

    validatePost = async (req:Request, res:Response): Promise<void> => {
    
        try{
            const post = await PostModel.findById(req.query.post_id)
            if(!post){
                res.status(404).json({"message" : "Post not found"})
                return 
            }
            if(!req.user){
                res.status(500).end()
                return 
            }       
            
            post.save()
            

            res.status(200).json({"message" : "You validate this post"})
            return


        }catch(err){
            res.status(400).json({"message" : "This is not a Post Id"})
            return
        }
    }

    readonly queryFollow = {
        "username" : "string"
    }

    follow = async (req: Request, res: Response): Promise<void> => {
        if (!req.user || req.user.username == req.body.username) {
            res.status(400).json({ "message": "You can't follow yourself" });
            return;
        }
    
        const following_user_username = req.user.username;
        const followed_user_username = req.body.username;
        try {
            const following_user = await UserModel.findOne({"username":following_user_username});
            const followed_user = await UserModel.findOne({"username":followed_user_username});
            if (!followed_user || !following_user) {
                res.status(404).json({ "message": "We can't find this user" });
                return;
            }
    
            const followIndex = followed_user.followers.indexOf(following_user_username);
            const followingIndex = following_user.following.indexOf(followed_user_username);
            if (followIndex !== -1) {
                followed_user.followers.splice(followIndex, 1);
                await followed_user.save();
                following_user.following.splice(followingIndex, 1); 
                await following_user.save();
                res.status(200).json({ "message": "You have unfollowed this user" });
            } else {
                followed_user.followers.push(following_user_username);
                await followed_user.save();
                following_user.following.push(followed_user_username);
                await following_user.save();
                res.status(200).json({ "message": "You are now following this user" });
            }
        } catch (e) {
            console.log(e);
            res.status(400).json({ "message": "This is not a user's username" });
            return;
        }
    };


      getFollowers = async (req: Request, res: Response): Promise<void> => {
        try {
            const user = await UserModel.findOne({"username":req.query.username});
            if (!user) {
                res.status(404).json({ "message": "User not found" });
                return;
            }
            
            res.status(200).json(user.followers);
        } catch (err) {
            console.error(err);
            res.status(500).json({ "message": "Internal Server Error" });
        }
    };
    getUsersByIds = async (req: Request, res: Response): Promise<void> => {
        try {
            const userIds = req.body.userIds; 
            if (!userIds || !Array.isArray(userIds)) {
                res.status(400).json({ "message": "Invalid request, userIds should be an array" });
                return;
            }
            
            const users = await UserModel.find({ _id: { $in: userIds } }).select('_id username'); 
            res.status(200).json(users);
        } catch (err) {
            console.error(err);
            res.status(500).json({ "message": "Internal Server Error" });
        }
    };
    deleteUsernameInPosts = async (username: string) => {
      try {
          const result = await PostModel.deleteMany(
              { username: username }
          );
  
          console.log('Number of documents deleted posts:', result.deletedCount);
      } catch (error) {
          console.error('Error deleting username in posts:', error);
      }
  }
  
  deleteUsernameInFollowers = async (username: string) => {
      try {
          const result = await UserModel.updateMany(
              { followers: username },
              { $pull: { followers: username } }
          );
  
          console.log('Number of documents matched followers:', result.matchedCount);
          console.log('Number of documents modified followers:', result.modifiedCount);
      } catch (error) {
          console.error('Error deleting username in followers:', error);
      }
  };
  
  deleteUsernameInFollowing = async (username: string) => {
      try {
          const result = await UserModel.updateMany(
              { following: username },
              { $pull: { following: username } }
          );
  
          console.log('Number of documents matched following:', result.matchedCount);
          console.log('Number of documents modified following:', result.modifiedCount);
      } catch (error) {
          console.error('Error deleting username in following:', error);
      }
  };
  
  deleteUsernameInHubUsers = async (username: string) => {
      try {
          const result = await HubModel.updateMany(
              { users: username },
              { $pull: { users: username } }
          );
  
          console.log('Number of documents matched hub users:', result.matchedCount);
          console.log('Number of documents modified hub users:', result.modifiedCount);
      } catch (error) {
          console.error('Error deleting username in hub users:', error);
      }
  };
  
  deleteUsernameInHubAdmins = async (username: string) => {
      try {
          const result = await HubModel.updateMany(
              { admins: username },
              { $pull: { admins: username } }
          );
  
          console.log('Number of documents matched hub admins:', result.matchedCount);
          console.log('Number of documents modified hub admins:', result.modifiedCount);
      } catch (error) {
          console.error('Error deleting username in hub admins:', error);
      }
  };
  
  deleteUsernameInPostLikes = async (username: string) => {
      try {
          const result = await PostModel.updateMany(
              { "like.username": username },
              { $pull: { like: { username: username } } }
          );
  
          console.log('Number of documents matched post likes:', result.matchedCount);
          console.log('Number of documents modified post likes:', result.modifiedCount);
      } catch (error) {
          console.error('Error deleting username in post likes:', error);
      }
  };

  deleteUsernameInPrograms = async (username: string) => {
    try {
        const result = await ProgramModel.deleteMany(
            { username: username }
        );

        console.log('Number of documents deleted programs:', result.deletedCount);
    } catch (error) {
        console.error('Error deleting username in programs:', error);
    }
}

  
  deleteUsernameInProgramLikes = async (username: string) => {
    try {
        const result = await ProgramModel.updateMany(
            { "like.username": username },
            { $pull: { like: { username: username } } }
        );

        console.log('Number of documents matched program likes:', result.matchedCount);
        console.log('Number of documents modified program likes:', result.modifiedCount);
    } catch (error) {
        console.error('Error deleting username in program likes:', error);
    }
};

deleteUsernameInWorkflows = async (username: string) => {
    try {
        const result = await WorkflowModel.deleteMany(
            { username: username }
        );

        console.log('Number of documents deleted programs:', result.deletedCount);
    } catch (error) {
        console.error('Error deleting username in programs:', error);
    }
}
deleteUsernameInComments = async (username: string) => {
  try {
      const result = await CommentModel.deleteMany(
          { username: username }
      );

      console.log('Number of documents deleted CommentModel:', result.deletedCount);
  } catch (error) {
      console.error('Error deleting username in CommentModel:', error);
  }
}

     deleteMe = async (req: Request, res: Response) => {
        try {
          const user = req.user;
          const username = user?.username
          if (!user) {
            throw new Error('User not found'); 
          }
          if (!username) {
            throw new Error('Username not found'); 
          }
          this.deleteUsernameInPosts(username)
          this.deleteUsernameInFollowers(username)
          this.deleteUsernameInFollowing(username)
          this.deleteUsernameInHubUsers(username)
          this.deleteUsernameInHubAdmins(username)
          this.deleteUsernameInPostLikes(username)
            this.deleteUsernameInPrograms(username)
            this.deleteUsernameInProgramLikes(username)
            this.deleteUsernameInWorkflows(username)
            this.deleteUsernameInComments(username)

          await UserModel.deleteOne( {user:user.username});



          res.status(200).json(user);
        } catch (error) {
          res.status(500).json({ error: 'Internal Server Error' });
        }
      };

    deleteOneUser = async (req: Request, res: Response): Promise<void> => {
        if(!req.query.id || typeof req.query.id !== "string"){
            res.status(400).end()
            return
        }

        let user
        try{
            user = await UserModel.findById(req.query.id).populate("roles")
            if(user){
                user.password = ""
                user.roles = []
            }
        }catch(e){
            res.status(404).json("User not found")
        }

        res.status(200).json(user)
    }

    getAllSession = async (req:Request, res:Response) => {
        try{
            const sessions = await SessionModel.find({
                user: req.user?._id
            })
            if (!sessions){
                res.status(404).json({"message": "Liar, how there is no session ?"})
                return
            }

            res.status(200).json(sessions)
        }catch(e){
            res.status(500).end()
            return 
        }
    }
    isUserFollowed = async (req: Request, res: Response): Promise<void> => {
        try {
            if (!req.user) {
                res.status(403).json({ "message": "Unauthorized" });
                return;
            }
    
            const userToCheck = req.query.username;
            if (!userToCheck || typeof userToCheck !== "string") {
                res.status(400).json({ "message": "Invalid or missing user ID" });
                return;
            }
    
            const user = await UserModel.findOne({"username":userToCheck});
            if (!user) {
                res.status(404).json({ "message": "User not found" });
                return;
            }
    
            const isFollowed = user.followers.some(followingUser => String(followingUser) === String(req.user?.username));
            res.status(200).json({ isFollowed: isFollowed });
        } catch (err) {
            console.error(err);
            res.status(500).json({ "message": "Internal Server Error" });
        }
    };

    getUserHubs = async (req:Request, res:Response): Promise<void> => {
        
        const user = req.user;
      
        if (!user) {
          throw new Error('User not found');
        }
        try {
            const hub = await HubModel.find({users:user.username});
            
            res.status(200).json(hub);
        } catch (err) {
            console.error(err);
            res.status(500).json({ "message": "Internal Server Error" });
        }
    };

    getFollowingInfo = async(req:Request, res:Response): Promise<void>=>{
        const user = req.user;
        if (!user){
            res.status(404).json({"message": "User not found"})
            return
        }
        const users = await UserModel.find({ followers: { $regex:`^${ req.user?.username}$` } });
        res.status(200).json(users);
    }   
    getFollowUsers = async (req: Request, res: Response): Promise<void> => {
        const usernameQuery = req.query.username as string;
    
        if (!usernameQuery) {
            res.status(400).json({ message: "Username query parameter is required" });
            return;
        }
    
        try {
            const user = await UserModel.findOne({ username: usernameQuery });
    
            if (!user) {
                res.status(404).json({ message: "User not found" });
                return;
            }
    
            const followingUsernames = user.following;
            const followersUsernames = user.followers;
    
            const followingUsers = await UserModel.find({ username: { $in: followingUsernames } });
            const followersUsers = await UserModel.find({ username: { $in: followersUsernames } });
    
            const response = {
                followingUsers,
                followersUsers
            };
    
            res.status(200).json(response);
        } catch (error) {
            res.status(500).json({ message: "Internal server error", error });
        }
    };


    readonly paramsUpdatePassword = {
      "currentPassword":"string",
      "newPassword": "string"

  };
  
  // Function to update the user's password
  updatePassword = async (req: Request, res: Response): Promise<void> => {
    
    const user = req.user;
    if (!user){
        res.status(404).json({"message": "User not found"})
        return
    }
      const { currentPassword,newPassword } = req.body;
  
           
      try {
          const userFind = await UserModel.findOne({username:user.username});
  
          if (!userFind) {
              res.status(404).json({ "message": "User not found" });
              return;
          }
          if (currentPassword) {
            const isCurrentPasswordValid = SecurityUtils.verifySHA512(
              currentPassword,
              userFind.password
            );
      
            if (!isCurrentPasswordValid) {
              res.status(400).json({ message: "Current password is incorrect" });
              return;
            }
          }
          const updateData: any = {
            ...(newPassword && { password: SecurityUtils.toSHA512(newPassword) }),
          };
          const updated_user = await UserModel.findOneAndUpdate({username:user.username},
          updateData,
          { new: true }
        );
      
      if (!updated_user) {
        res.status(404).end();
        return;
      }
  
          res.status(200).json({ "message": "Password updated successfully" });
      } catch (error:any) {
          res.status(500).json({ "message": "An error occurred while updating the password", "error": error.message });
      }
  };
    buildRouter = (): Router => {
         
        const router = express.Router()
        router.post('/get-users-by-ids', express.json(), this.getUsersByIds.bind(this)); 
        router.post(`/subscribe`, express.json(), checkBody(this.paramsLogin), this.subscribe.bind(this))
        router.get('/follow', express.json(), checkUserToken(), this.getFollowers.bind(this))
        router.get('/following', express.json(), checkUserToken(), this.getFollowingInfo.bind(this))
        router.get('/follow-info', express.json(), checkUserToken(), this.getFollowUsers.bind(this))
        router.get('/me', checkUserToken(), this.me.bind(this))
        router.get('/count', checkUserToken(), checkUserRole(RolesEnums.admin), this.getAllUsers.bind(this))
        router.get('/one', checkUserToken(), checkUserRole(RolesEnums.guest), this.getOneUser.bind(this))
        router.get('/one-by-username', checkUserToken(), checkUserRole(RolesEnums.guest), this.getOneUserByUsername.bind(this))
        router.get('/role', checkUserToken(), checkUserRole(RolesEnums.admin), this.getRoles.bind(this))
        router.get('/post', checkUserToken(), checkQuery(this.queryGetPost), this.getAllPost.bind(this))
        router.get('/all', checkUserToken(), this.getAllUsersInfo.bind(this))
        router.get('/sessions', checkUserToken(), this.getAllSession.bind(this))
        router.get('/is-liked', checkUserToken(), this.isUserFollowed.bind(this))
        router.get('/hubs', checkUserToken(), this.getUserHubs.bind(this))
        router.patch('/', express.json(), checkUserToken(), checkBody(this.paramsUpdateUser), this.updateUser.bind(this))
        router.patch('/password', express.json(), checkUserToken(), checkBody(this.paramsUpdatePassword), this.updatePassword.bind(this))
        router.patch('/validate', express.json(), checkUserToken(), checkQuery(this.queryValidatePost), this.validatePost.bind(this))
        router.patch('/role', express.json(), checkUserToken(), checkUserRole(RolesEnums.admin), checkBody(this.paramsGiveRole), this.addRole.bind(this))
        router.post('/follows', express.json(), checkUserToken(), checkBody(this.queryFollow), this.follow.bind(this))
        router.delete('/me', checkUserToken(), this.deleteMe.bind(this))
        
        router.delete('/one', checkUserToken(), checkUserRole(RolesEnums.admin), this.deleteOneUser.bind(this))
        return router
    }
}