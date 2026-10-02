import mongoose, { Schema, Model } from "mongoose";
import { Role } from "./role.model";
import { Post } from "./post.model";

const userShemma = new Schema<User>({
    login: {
        type: Schema.Types.String,
        index: true,
        unique: true,
        required : true
    },
    password:{
        type: Schema.Types.String,
        required: true
    },
    username: {
        type: Schema.Types.String,
        unique: true,
        required: true,
    },
    roles:[{
        type: Schema.Types.ObjectId,
        ref: "Role",
        required: true
    }],
    profileImageUrl: {
        type: Schema.Types.String,
        required: true
    },
    backgroundImageUrl:{
        type: Schema.Types.String,
        required: false
    },
    description: {
        type: Schema.Types.String,
        required: false
    },
    joinDate : {
        type: Schema.Types.Date,
        required: true
    },
    followers: [{
        type: Schema.Types.String,
        required: true
    }],
    following: [{
        type: Schema.Types.String,
        required: true
    }]

}, {
    versionKey: false,
    collection: "Users"
})

export interface User{
    _id: string
    login: string
    password: string
    username: string
    roles: Role[]

    profileImageUrl: string
    backgroundImageUrl:string
    description: string
    joinDate: Date

    followers: any[]
    following: any[]
}

export const UserModel: Model<User> = mongoose.model("User", userShemma)