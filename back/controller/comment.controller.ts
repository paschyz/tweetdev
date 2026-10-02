import { Request, Response, Router } from "express";
import mongoose, { Model } from "mongoose";
import { Comment, CommentModel } from "../models/comment.model"
import { checkUserToken, checkBody } from "../middleware"; // Adjust the import based on your middleware

import * as express from "express"
export class CommentController {
    readonly path: string;
    readonly model: Model<Comment>;

    constructor() {
        this.path = "/comments";
        this.model = CommentModel;
    }

    getAllComments = async (req: Request, res: Response): Promise<void> => {
        const comments = await this.model.find();
        res.status(200).json(comments);
    };

    readonly commentCreateParams = {
        description: "string",
        postId: "string"
    };

    createComment = async (req: Request, res: Response): Promise<void> => {
        const { description, postId } = req.body;
        const username = req.user?.username;

        if (!username) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        try {
            const newComment = await this.model.create({ description, username, postId,
                creationDate: new Date(), });
            res.status(201).json(newComment);
        } catch (error: any) {
            res.status(500).json({ message: "An error occurred while creating the comment", error: error.message });
        }
    };

    readonly commentUpdateParams = {
        description: "string"
    };

    updateComment = async (req: Request, res: Response): Promise<void> => {
        const id = req.query.id as string;
        const { description } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: "Invalid comment ID format" });
            return;
        }

        try {
            const updatedComment = await this.model.findByIdAndUpdate(id, { description }, { new: true });
            if (updatedComment) {
                res.status(200).json(updatedComment);
            } else {
                res.status(404).json({ message: "Comment not found" });
            }
        } catch (error: any) {
            res.status(500).json({ message: "An error occurred while updating the comment", error: error.message });
        }
    };

    deleteComment = async (req: Request, res: Response): Promise<void> => {
        const id = req.query.id as string;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: "Invalid comment ID format" });
            return;
        }

        try {
            const deletedComment = await this.model.findByIdAndDelete(id);
            if (deletedComment) {
                res.status(200).json({ message: `Comment ${id} deleted` });
            } else {
                res.status(404).json({ message: "Comment not found" });
            }
        } catch (error: any) {
            res.status(500).json({ message: "An error occurred while deleting the comment", error: error.message });
        }
    };

    getOneComment = async (req: Request, res: Response): Promise<void> => {
        const id = req.query.id as string;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: "Invalid comment ID format" });
            return;
        }

        try {
            const comment = await this.model.findById(id);
            if (comment) {
                res.status(200).json(comment);
            } else {
                res.status(404).json({ message: "Comment not found" });
            }
        } catch (error: any) {
            res.status(500).json({ message: "An error occurred while retrieving the comment", error: error.message });
        }
    };
    isCommentDeletable = async (req: Request, res: Response): Promise<void> => {
        const id = req.query.id as string;
        const username = req.user?.username;

        if (!username) {
            res.status(401).json({ message: 'You are not logged in' });
            return;
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: 'Invalid comment ID format' });
            return;
        }

        try {
            const comment = await this.model.findById(id);

            if (!comment) {
                res.status(404).json({ message: 'Comment not found' });
                return;
            }

            if (comment.username === username) {
                res.status(200).json(true);
                return;
            }

            res.status(200).json(false);
        } catch (error) {
            console.error('Error retrieving comment:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };

    buildRouter = (): Router => {
        const router = Router();
        router.get('/', checkUserToken(), this.getAllComments.bind(this));
        router.get('/one', checkUserToken(), this.getOneComment.bind(this));
        router.get('/is-deletable', checkUserToken(), this.isCommentDeletable.bind(this));
        router.post('/', express.json(), checkUserToken(), checkBody(this.commentCreateParams), this.createComment.bind(this));
        router.patch('/', checkUserToken(), checkBody(this.commentUpdateParams), this.updateComment.bind(this));
        router.delete('/', checkUserToken(), this.deleteComment.bind(this));
        return router;
    };
}
