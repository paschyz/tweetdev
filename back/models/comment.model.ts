import mongoose, { Schema, Model } from "mongoose";
const commentSchema = new Schema<Comment>({
    description: {
        type: Schema.Types.String,
        required : true
    },
    username: {
        type: Schema.Types.String,
        required: true
    },
    postId: {
        type: Schema.Types.String,
        required: true
    },
    creationDate: {
        type: Schema.Types.Date,
        required: true
    }
}, {
    versionKey: false,
    collection: "Comments"
})

export interface Comment{
    description: string,
    username: string,
    postId:string
    creationDate: Date;
}

export const CommentModel: Model<Comment> = mongoose.model("Comment", commentSchema)