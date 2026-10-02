import mongoose, { Schema, Model } from "mongoose";

// Définition du schéma pour SaveCode
const saveCodeSchema = new Schema<SaveCode>({
    name: {
        type: Schema.Types.String,
        required: true,
    },
    code: {
        type: Schema.Types.String,
        required: true,
    },
    language: {
        type: Schema.Types.String,
        required: true,
    },
}, {
    versionKey: false,
    collection: "SaveCodes"
});

// Définition de l'interface TypeScript pour SaveCode
export interface SaveCode {
    _id: string;
    name: string;
    code: string;
    language: string;
}

// Export du modèle Mongoose pour SaveCode
export const SaveCodeModel: Model<SaveCode> = mongoose.model("SaveCode", saveCodeSchema);
