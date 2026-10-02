import mongoose, { Document, Model } from "mongoose"
import { Post, PostModel } from "../models/post.model"
import * as express from "express"
import { Router, Response, Request } from "express"
import { checkBody, checkUserRole, checkUserToken } from "../middleware"
import { RolesEnums } from "../enums"
import { checkQuery } from "../middleware/query.middleware"
import { CommentModel, HubModel, Like, ProgramModel, UserModel, WorkflowModel } from "../models"

// ponytail: the front's LikeButton sends posts, programs and workflows to /post/like,
// so look the id up in all three. Give each its own route if they ever diverge.
const findLikeable = async (id: unknown): Promise<(Document & { like: Like[] }) | null> => {
    for (const model of [PostModel, ProgramModel, WorkflowModel] as Model<any>[]) {
        const doc = await model.findById(id)
        if (doc) return doc
    }
    return null
}

export class PostController {

    readonly path: string
    readonly model: Model<Post>


    constructor(){
        this.path = "/post"
        this.model = PostModel
    }

    readonly paramsNewPost = {
        "content" : "string"
    }

    newPost = async (req: Request, res: Response): Promise<void> => {
        const newPost = await PostModel.create({
            content: req.body.content,
            like: [],
            comments: [],
            creationDate: new Date(),
            username : req.user?.username,
            hubname : req.body.hubname ? req.body.hubname : null,
            program : req.body.program ? req.body.program : null,
        })
        
        res.status(201).json(newPost)
        return 
    }

    readonly queryPostId = { 
        "id" : "string"
    }

    getOnePost = async (req:Request, res:Response): Promise<void> => {
        
        try{
            const post = await PostModel.findById(req.query.id).populate({
                path: "comments"
            })
            if (!post){
                res.status(404).end()
                return 
            }
            res.status(200).json(post)
        }catch(err){
            res.status(404).end()
            return
        }
    }

    readonly paramsComment = {
        "id_post" : "string",
        "description": "string"
    }

    addComment = async (req: Request, res: Response): Promise<void> => {

        let post : (Document<unknown, {}, Post> & Omit<Post & Required<{_id: string;}>, never>) | null  

        try{
            post = await PostModel.findById(req.body.id_post)
            if(!post){
                res.status(404).json({"message": "Post not found"})
            }
        }catch(err){
            res.status(404).end()
            return
        }

        const newComment = await CommentModel.create({
            description: req.body.description,
            author: req.user
        })

        post?.comments.push(newComment)
        post?.save()

        res.status(201).json(newComment)
        return

    }

    readonly paramsLike = {
        "post_id" : "string"
    }

    likePost = async (req: Request, res: Response): Promise<void> => {
        if (!mongoose.Types.ObjectId.isValid(req.body.post_id)) {
            res.status(400).json({ message: 'Invalid Post ID format' });
            return; 
        }
        try {
            
            const post = await findLikeable(req.body.post_id);
            const emojiIndex = req.body.emojiIndex;
            if (!post) {
                res.status(404).json({ "message": "Post not found" });
                return;
            }
            if (!req.user) {
                res.status(403).end();
                return;
            }
    
            const userLikedIndex = post.like.findIndex(l => String(l.username) === String(req.user?.username));
    
            if (userLikedIndex === -1) {
                post.like.push(
                    {
                        username: req.user?.username,
                        emojiIndex: emojiIndex
                    }
                );
                await post.save();
                res.status(200).json({ "message": "Post liked" });
            } else {
                post.like.splice(userLikedIndex, 1);
                await post.save();
                res.status(200).json({ "message": "Post like removed" });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ "message": "Internal Server Error" });
        }
    };
    

    nbrLike = async (req: Request, res: Response): Promise<void> => {
        
        try{
            const post = await PostModel.findById(req.query.id)
            if(!post){
                res.status(404).end()
                return
            }

            res.status(200).json({"likes" : post.like.length})
            
        }catch(err){
            res.status(404).end()
            return
        }
    }

    deletePost = async (req:Request, res:Response):Promise<void> => {
        try{
            const post = await PostModel.findById(req.query.id)
            if(!post){
                res.status(404).json({"message" :"Post not found"})
                return 
            }


                post.deleteOne()
                post.save()
                res.status(200).json({"message" : "Post deleted"})
                return 
 
        }catch(err){
            res.status(401).json({"message": "This is not a post Id"})
            return 
        }
    }

    deleteUsernameInComments = async (id: string) => {
        try {
            const result = await CommentModel.deleteMany(
                { postId: id }
            );
      
            console.log('Number of documents deleted CommentModel:', result.deletedCount);
        } catch (error) {
            console.error('Error deleting username in CommentModel:', error);
        }
      }
    deletePostById = async (req: Request, res: Response): Promise<void> => {
        const id = req.query.id as string;
        const username = req.user?.username;
    
        if (!id) {
            res.status(400).json({ message: 'Post ID is required' });
            return;
        }
        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: 'Invalid Post ID format' });
            return;
        }
    
        if (!username) {
            res.status(401).json({ message: 'You are not logged in' });
            return;
        }
    
        try {
            const post = await PostModel.findById(id);
    
            if (!post) {
                res.status(404).json({ message: 'Post not found' });
                return;
            }
    
            if (post.username === username) {
                await post.deleteOne();
                await this.deleteUsernameInComments(id);
                res.status(200).json({ message: `Post ${id} deleted` });
                return;
            }

            
            if (post.hubname) {
                const hub = await HubModel.findOne({ name: post.hubname });
    
                if (!hub) {
                    res.status(404).json({ message: 'Hub not found' });
                    return;
                }
    
                if (hub.admins.includes(username)) {
                    await post.deleteOne();
                    res.status(200).json({ message: `Post ${id} deleted` }); 
                    return;
                }
            }else {
                res.status(401).json({ message: 'You are not the owner' });
            }
        } catch (error) {
            console.error('Error deleting post:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };


    getAllPosts = async (req:Request, res:Response): Promise<void> => {
        const all_post = await PostModel.find()
        res.status(200).json(all_post)
        return 
    }
    getSelfPosts = async (req: Request, res: Response): Promise<void> => {
        try {
            const username = req.query.username || req.user?.username;
            if (!username) {
                res.status(401).json({"message": "Unauthorized"});
                return;
            }

            const userPosts = await PostModel.find({ username: username });
            res.status(200).json(userPosts);
        } catch (err) {
            res.status(500).json({"message": "An error occurred while retrieving posts"});
        }
    }

    getUserPosts = async (req: Request, res: Response): Promise<void> => {
        try {
            const username = req.query.username || req.user?.username;
            if (!username) {
                res.status(401).json({"message": "Unauthorized"});
                return;
            }

            const userPosts = await PostModel.find({ username: username });
            res.status(200).json(userPosts);
        } catch (err) {
            res.status(500).json({"message": "An error occurred while retrieving posts"});
        }
    }
    isPostLikedByUser = async (req: Request, res: Response): Promise<void> => {
        const post_id = req.query.post_id;
        if (!mongoose.Types.ObjectId.isValid(post_id as string)) {
            res.status(400).json({ message: 'Invalid Post ID format' });
            return;
        }
        try {
            const post = await findLikeable(post_id);
            if (!post) {
                res.status(404).json({ "message": "Post not found" });
                return;
            }
            if (!req.user) {
                res.status(403).end();
                return;
            }
    
            const like = post.like.find(user => String(user.username) === String(req.user?.username));
            const isLiked = !!like;
            const emojiIndex = like ? like.emojiIndex : null;
    
            res.status(200).json({ liked: isLiked, emojiIndex: emojiIndex });
        } catch (err) {
            res.status(500).json({ "message": "Internal Server Error" });
        }
    };
    
    getFollowedUsersPosts = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.user?._id;
            if (!userId) {
                res.status(401).json({ "message": "Unauthorized" });
                return;
            }

            const user = await UserModel.findById(userId).populate("followers", "_id");

            if (!user) {
                res.status(404).json({ "message": "User not found" });
                return;
            }

            const followedUsersIds = user.followers.map((followedUser: any) => followedUser._id);

            const posts = await PostModel.find({ userId: { $in: followedUsersIds } });

            res.status(200).json(posts);
        } catch (err) {
            console.error(err);
            res.status(500).json({ "message": "Internal Server Error" });
        }
    };



    isPostDeletable = async (req: Request, res: Response): Promise<void> => {
        const id = req.query.id as string;
        const username = req.user?.username;
    
        if (!username) {
            res.status(401).json({ message: 'You are not logged in' });
            return;
        }
    
        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: 'Invalid Post ID format' });
            return;
        }
    
        try {
            const post = await PostModel.findById(id);
    
            if (!post) {
                res.status(404).json({ message: 'Post not found' });
                return;
            }
    
            if (post.username === username) {
                res.status(200).json(true);
                return;
            }
    
            if (post.hubname) {
                const hub = await HubModel.findOne({ name: post.hubname });
    
                if (!hub) {
                    res.status(404).json({ message: 'Hub not found' });
                    return;
                }
    
                if (hub.admins.includes(username)) {
                    res.status(200).json(true); 
                    return;
                }
            }
    
            res.status(200).json(false);
        } catch (error) {
            console.error('Error retrieving post or hub:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };
    getComments = async (req: Request, res: Response): Promise<void> => {
        const postId = req.query.id as string;

        if (!postId) {
            res.status(400).json({ message: "postId query parameter is required" });
            return;
        }

        try {
            const comments = await CommentModel.find({ postId });
            res.status(200).json(comments);
        } catch (error: any) {
            res.status(500).json({ message: "An error occurred while retrieving the comments", error: error.message });
        }
    };
    buildRouter = (): Router => {
        const router = express.Router()
        router.get('/', checkUserToken(), checkUserRole(RolesEnums.guest), checkQuery(this.queryPostId), this.getOnePost.bind(this))
        router.get('/all', checkUserToken(), this.getAllPosts.bind(this))
        router.get('/comments', checkUserToken(), this.getComments.bind(this))
        router.get('/followed-users-posts', checkUserToken(), this.getFollowedUsersPosts.bind(this)); 
        router.get('/user-posts', checkUserToken(), this.getUserPosts.bind(this))
        router.get('/is-deletable', checkUserToken(), this.isPostDeletable.bind(this))
        router.get('/like', checkUserToken(),checkQuery(this.queryPostId), this.nbrLike.bind(this))
        router.get('/is-liked', checkUserToken(), this.isPostLikedByUser.bind(this)); 
        router.post('/', express.json(), checkUserToken(), checkUserRole(RolesEnums.guest), checkBody(this.paramsNewPost), this.newPost.bind(this))
        router.post('/comment', express.json(), checkUserToken(), checkBody(this.paramsComment), this.addComment.bind(this))
        router.patch('/like', express.json(), checkUserToken(), checkBody(this.paramsLike), this.likePost.bind(this))
        router.delete('/', checkUserToken(), checkQuery(this.queryPostId), this.deletePostById.bind(this))
        return router
    }
}