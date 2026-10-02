import mongoose, { Schema, Model } from "mongoose";
import { Like, likeSchema } from "./like.schema";


const workflowSchema = new Schema<Workflow>({
    name: {
        type: Schema.Types.String,
        required: true,
    },
    like: [likeSchema], 
    username :{
        type: Schema.Types.String,
        required: false
    },
    creationDate : {
        type: Schema.Types.Date,
        required: true
    },
    versions: [{
        name: {
            type: Schema.Types.String,
            required: true
        },
        content: {
            type: Schema.Types.Mixed,
            required: true
        },
        creationDate : {
            type: Schema.Types.Date,
            required: true
        },
    }]
    
}, {
    versionKey: false,
    collection: "Workflows"
})
export interface Workflow{
    _id: string
    name: string
    username:string
    like: Like[]
    creationDate: Date
    versions: {
        name: string;
        content: any;
        creationDate: Date;
    }[];
}

export const WorkflowModel: Model<Workflow> = mongoose.model("Workflow", workflowSchema)