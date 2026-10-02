import { Schema } from "mongoose";

export const likeSchema = new Schema({
    username: {
        type: Schema.Types.String,
        ref: "User",
        required: true
    },
    emojiIndex: {
        type: Schema.Types.Number,
        required: true
    }
}, { _id: false });


export interface Like {
    username: string;
    emojiIndex: number;
}