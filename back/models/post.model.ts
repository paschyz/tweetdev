import mongoose, { Schema, Model } from "mongoose";
import { User } from "./user.model";
import { Comment } from "./comment.model";
import { Like, likeSchema } from "./like.schema";


const postShemma = new Schema<Post>({
    content:{
        type: Schema.Types.String,
        required: true
    },
    like: [likeSchema], 
    comments: [{
        type: Schema.Types.ObjectId,
        ref: "Comment",
        required: false
    }],
    creationDate: {
        type: Schema.Types.Date,
        required: true
    },
    username: {
        type: Schema.Types.String,
        required: true
    },
    hubname: {
        type: Schema.Types.String,
        required: false
    },
    program: {
        type: Schema.Types.String,
        required: false
    },
}, {
    versionKey: false,
    collection: "Posts"
})
export interface Post{
    _id: string
    content: string
    like: Like[]
    comments: Comment[]
    creationDate : Date
    username: string
    hubname: string | undefined
    program: string; 
}


export const PostModel: Model<Post> = mongoose.model("Post", postShemma)