import { Model } from "mongoose"
import { Hub, HubModel, PostModel, UserModel } from "../models"

import * as express from "express"
import { Router, Response, Request } from "express"
import { checkBody, checkUserToken } from "../middleware"
import { checkQuery } from "../middleware/query.middleware"

export class HubController {

    readonly path: string
    readonly model: Model<Hub>

    constructor(){
        this.path = "/hub"
        this.model = HubModel
    }

    getAllHubs = async (req:Request, res:Response): Promise<void> => {
        const hubs = await HubModel.find()
        res.status(200).json(hubs)
        return 
    }
getHubByName = async (req: Request, res: Response): Promise<void> => {
    const name = req.query.name as string;

    if (!name) {
        res.status(400).json({ message: 'Name query parameter is required' });
        return;
    }

    try {
        const hub = await HubModel.findOne({ name }).lean().exec(); // Using lean() to return plain JavaScript objects

        if (!hub) {
            res.status(404).json({ message: 'Hub not found' });
            return;
        }

        res.status(200).json(hub);
    } catch (error) {
        console.error('Error retrieving hub:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
    isAdmin = async (req:Request, res:Response): Promise<void> => {
        const name = req.query.name as string;

        const username = req.user?.username;
        try {
            if (username){
                const hub = await HubModel.findOne({ name });
            if (!hub) {
                res.status(404).json({ message: 'Hub not found' });
                return;
            }
            const isAdmin = hub.admins.includes(username);
    
            res.status(200).json(isAdmin);
            }else{
                res.status(401).json({ message: 'You are not logged in' });
            }
            
        } catch (error) {
            console.error('Error retrieving hub:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };

    deleteHubByName = async (req:Request, res:Response): Promise<void> => {
        const name = req.query.name as string;
        const username = req.user?.username;
        try {
            const hub = await HubModel.findOne({ name });
    
            if (!hub) {
                res.status(404).json({ message: 'Hub not found' });
                return;
            }
            if(username){
                if(hub.admins.includes(username)){
                    await HubModel.deleteOne({name})
                    await PostModel.deleteMany({hubname:name})
                    res.status(200).json({ message: `Hub ${name} deleted` });
                }
                else{
                    res.status(401).json({ message: 'You are not an admin' });
                }
            }else{
                res.status(401).json({ message: 'You are not logged in' });
            }
        } catch (error) {
            console.error('Error retrieving hub:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };

    readonly createHubBody = {
        "name" : "string",
        "description" : "string",
        "profileImageUrl" : "string",
        "coverImageUrl" : "string",
    }

    createHub = async (req:Request, res:Response): Promise<void> => {
        if(req.user)
        try {
            const name = req.body.name;
            const description = req.body.description;
            const profileImageUrl = req.body.profileImageUrl;
            const coverImageUrl = req.body.coverImageUrl;
            const creationDate = new Date();
            const admins = [req.user.username]

        const hub = await HubModel.create({
            name:name,
            description:description,
            profileImageUrl:profileImageUrl,
            coverImageUrl:coverImageUrl,
            creationDate:creationDate,
            users:[req.user.username],
            admins:admins
        })
        res.json(hub)
            }catch(err: any){
                    if (err.name === 'MongoServerError' && err.code === 11000) {
              const duplicatedField = Object.keys(err.keyValue)[0]; 
              const errorMessage = duplicatedField === 'name'
                ? 'The username is already in use.'
                : 'A unique field is already in use.';
              
            res.status(409).json({ message: errorMessage})
        
        }else{
            res.status(500).end()
        
        }
    }}


    getHubsByUsername = async (req:Request, res:Response): Promise<void> => {
        const users = req.query.username as string;

        try {
            const hub = await HubModel.find({ users });
    
            if (!hub) {
                res.status(404).json({ message: 'Hub not found' });
                return;
            }
    
    
            res.status(200).json(hub);
        } catch (error) {
            console.error('Error retrieving hub:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };
    getHubPosts = async (req:Request, res:Response): Promise<void> => {
        const hubByName = req.query.name as string;

        try {
            const hub = await HubModel.find({ hubByName });
    
            if (!hub) {
                res.status(404).json({ message: 'Hub not found' });
                return;
            }
    
    
            res.status(200).json(await PostModel.find({ hubname:req.query.name}));

        } catch (error) {
            console.error('Error retrieving hub:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };

    toggleFollowHub = async (req:Request, res:Response): Promise<void> => {
        const name = req.query.name as string;
        const user = req.user;
      
        if (!user) {
          throw new Error('User not found');
        }
        try {
            const hub = await HubModel.findOne({ name });
    
            if (!hub) {
                res.status(404).json({ message: 'Hub not found' });
                return;
            }
    
            const userIndex = hub.users.indexOf(user.username);
            if (userIndex !== -1) {
                hub.users.splice(userIndex, 1);
                await hub.save();
                res.status(200).json({ message: 'User unfollowed the hub' });
            } else {
                hub.users.push(user.username);
                await hub.save();
                res.status(200).json({ message: 'User followed the hub' });
            }
        } catch (error) {
            console.error('Error retrieving hub:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };


    isHubFollowed = async (req:Request, res:Response): Promise<void> => {
        const name = req.query.name as string;
        const user = req.user;
      
        if (!user) {
          throw new Error('User not found');
        }
        try {
            const hub = await HubModel.findOne({ name });
    
            if (!hub) {
                res.status(404).json({ message: 'Hub not found' });
                return;
            }
    
            const isFollowed = hub.users.some(userFollowing=> String(userFollowing) ==String(user.username))

            res.status(200).json({ isFollowed });
        } catch (error) {
            console.error('Error retrieving hub:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };

    updateHubnameInPosts = async (last_name:string, new_name:string) => {
        const posts = await PostModel.find({hubname:last_name})
        posts.forEach(async (post) => {
            post.hubname = new_name
            await post.save()
        })
    }
    readonly paramsUpdateHub = {
        "name" : "string",
        "description" : "string",
        "profileImageUrl": "string",
        "coverImageUrl": "string",
    }
    updateHub = async (req: Request, res: Response): Promise<void> => {
        const name = req.query.name as string;
        const  hubInfo = req.body;
        const user = req.user;
        console.log(hubInfo)
        if (!user) {
          res.status(401).json({ message: 'User not found' });
          return;
        }
      
        try {
          const hub = await HubModel.findOne({ name });
      
          if (!hub) {
            res.status(404).json({ message: 'Hub not found' });
            return;
          }
      
          if (!hub.admins.includes(user.username)) {
            res.status(401).json({ message: 'You are not an admin' });
            return;
          }
      
          const updatedHub = await HubModel.findOneAndUpdate(
            { name },
            hubInfo,
            { new: true }
          );
      
          if (hubInfo && hubInfo.name && hubInfo.name !== name) {
            this.updateHubnameInPosts(name, hubInfo.name); 
          }
      
          res.status(200).json(updatedHub);
        } catch (error) {
          console.error('Error updating hub:', error);
          res.status(500).json({ message: 'Internal server error' });
        }
      };



    buildRouter = (): Router => {
        const router = express.Router()
        router.get('/', checkUserToken(), this.getAllHubs.bind(this))
        router.get('/all', checkUserToken(), this.getHubsByUsername.bind(this))
        router.get('/is-admin', checkUserToken(), this.isAdmin.bind(this))
        router.post('/create', checkUserToken(),express.json(),checkBody(this.createHubBody), this.createHub.bind(this))
        router.get('/by-name', checkUserToken(), this.getHubByName.bind(this))
        router.get('/posts', checkUserToken(), this.getHubPosts.bind(this))
        router.put('/follow', checkUserToken(), this.toggleFollowHub.bind(this))
        router.get('/is-followed', checkUserToken(), this.isHubFollowed.bind(this))
        router.patch('/update', express.json(), checkUserToken(), this.updateHub.bind(this))
        router.delete('/delete', checkUserToken(), this.deleteHubByName.bind(this))

        return router
    }
}