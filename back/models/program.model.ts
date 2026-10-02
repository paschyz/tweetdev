import mongoose, { Schema, Model } from "mongoose";
import { Like, likeSchema } from "./like.schema";

enum Language {
    python = "python",
    javascript = "javascript"
}

const programSchema = new Schema<Program>({
    name: {
        type: Schema.Types.String,
        required: true,
    },
    content: {
        type: Schema.Types.String,
        required: false
    },
    like: [likeSchema],
    comments: [{
        type: Schema.Types.ObjectId,
        ref: "Comment",
        required: false
    }],
    inputFileType: {
        type: Schema.Types.String,
        required: true
    },
    outputFileType: {
        type: Schema.Types.String,
        required: true
    },
    username: {
        type: Schema.Types.String,
        required: false
    },
    creationDate: {
        type: Schema.Types.Date,
        required: true
    },
    language: {
        type: Schema.Types.String,
        enum: Object.values(Language), 
        required: true
    }
}, {
    versionKey: false,
    collection: "Programs"
});

export interface Program {
    _id: string;
    name: string;
    content: string;
    like: Like[];
    comments: Comment[];
    inputFileType: string;
    outputFileType: string;
    username: string;
    creationDate: Date;
    language: Language; 
}

export const ProgramModel: Model<Program> = mongoose.model("Program", programSchema);
