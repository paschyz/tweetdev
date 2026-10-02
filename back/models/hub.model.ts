import mongoose, { Schema, Model } from "mongoose";

const hubSchema = new Schema<Hub>({
    name: {
        type: Schema.Types.String,
        unique: true,
        required: true,
    },
    description: {
        type: Schema.Types.String,
        required: false
    },
    users:[{
        type: Schema.Types.String,
        required: false
    }],
    profileImageUrl: {
        type: Schema.Types.String,
        required: true
    },
    coverImageUrl:{
        type: Schema.Types.String,
        required: true
    },
    creationDate : {
        type: Schema.Types.Date,
        required: true
    },
    admins : [{
        type: Schema.Types.String,
        required: false
    }],


}, {
    versionKey: false,
    collection: "Hubs"
})

export interface Hub{
    _id: string
    name: string
    description: string
    creationDate: Date
    profileImageUrl: string
    coverImageUrl:string
    users: string[]
    admins:string[]
}

export const HubModel: Model<Hub> = mongoose.model("Hub", hubSchema)