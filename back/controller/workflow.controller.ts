import mongoose, { Model } from "mongoose"
import { Workflow, WorkflowModel } from "../models"

import * as express from "express"
import { Router, Response, Request } from "express"
import { checkBody, checkUserRole, checkUserToken } from "../middleware"
import { checkQuery } from "../middleware/query.middleware"
import { RolesEnums } from "../enums"
const workflowSample={"nodes":[{"id":"1","type":"run-node","data":{"label":"Run"},"position":{"x":{"$numberInt":"-264"},"y":{"$numberInt":"20"}},"width":{"$numberInt":"90"},"height":{"$numberInt":"90"},"selected":false,"positionAbsolute":{"x":{"$numberInt":"-264"},"y":{"$numberInt":"20"}},"dragging":false},{"id":"4","type":"finish-node","data":{"label":"Finish"},"position":{"x":{"$numberDouble":"255.49198184568831"},"y":{"$numberDouble":"23.020121028744313"}},"width":{"$numberInt":"90"},"height":{"$numberInt":"90"},"positionAbsolute":{"x":{"$numberDouble":"255.49198184568831"},"y":{"$numberDouble":"23.020121028744313"}},"selected":false,"dragging":false}],"edges":[],"viewport":{"x":{"$numberDouble":"393.66952544311033"},"y":{"$numberDouble":"361.39441585668"},"zoom":{"$numberDouble":"1.2597674861825805"}}}
const workflowSample2={
    "nodes": [
        {
            "id": "1",
            "type": "run-node",
            "data": {
                "label": "Run"
            },
            "position": {
                "x": 0,
                "y": 0
            },
            "width": 90,
            "height": 90,
            "positionAbsolute": {
                "x": 0,
                "y": 0
            }
        },
        {
            "id": "2",
            "type": "finish-node",
            "data": {
                "label": "Finish"
            },
            "position": {
                "x": 600,
                "y": 0
            },
            "width": 90,
            "height": 90,
            "positionAbsolute": {
                "x": 600,
                "y": 0
            }
        }
    ],
    "edges": [],
    "viewport": {
        "x": 39.54545454545462,
        "y": 387.9189723320158,
        "zoom": 1.1462450592885374
    }
}
export class WorkflowController {

    readonly path: string
    readonly model: Model<Workflow>

    constructor(){
        this.path = "/workflow"
        this.model = WorkflowModel
    }

    getAllWorkflows = async (req:Request, res:Response): Promise<void> => {
        const workflows = await WorkflowModel.find()
        res.status(200).json(workflows)
        return 
    }
    readonly workflowsNewProgram = {
        "name":"string"
    }

    newWorkflow = async (req: Request, res: Response): Promise<void> => {
        const newWorkflow = await WorkflowModel.create({
            name: req.body.name,
            username : req.user?.username,
            creationDate: new Date(),
            versions : [{
                name:"1.0",
                content: workflowSample2,
                creationDate: new Date()
            }]
        })
        
        res.status(201).json(newWorkflow)
        return 
    }
    readonly cloneWorkflowParams = {
        "content" : "object",
        "name":"string"
    }


    cloneWorkflow = async (req: Request, res: Response): Promise<void> => {
        const newWorkflow = await WorkflowModel.create({
            name: req.body.name,
            username : req.user?.username,
            creationDate: new Date(),
            versions : [{
                name:"1.0",
                content: req.body.content,
                creationDate: new Date()
            }]
        })
        
        res.status(201).json(newWorkflow)
        return 
    }

    readonly paramsUpdateWorkflow = {
        "content" : "object",
    }



    updateWorkflow = async (req: Request, res: Response): Promise<void> => {
        const id = req.query.id as string; 
        
        const { content } = req.body;
    
        try {
            const existingWorkflow = await WorkflowModel.findById(id);
    
            if (!existingWorkflow) {
                res.status(404).json({ error: 'Workflow not found' });
                return;
            }
    
            let nextVersionNumber = 1;
    
            if (existingWorkflow.versions.length > 0) {
                const latestVersion = existingWorkflow.versions[existingWorkflow.versions.length - 1];
                const latestVersionNumber = parseFloat(latestVersion.name); 
    
                if (!isNaN(latestVersionNumber)) {
                    nextVersionNumber = latestVersionNumber + 0.1;
                }
            }
    
            const nextVersionName = nextVersionNumber.toFixed(1);
    
            existingWorkflow.versions.push({
                name: nextVersionName,
                content,
                creationDate: new Date()
            });
    
            await existingWorkflow.save();
    
            res.status(200).json(existingWorkflow);
        } catch (error) {
            console.error('Error updating workflow:', error);
            res.status(500).json({ error: 'Failed to update workflow' });
        }
    };
    upgradeWorkflow = async (req: Request, res: Response): Promise<void> => {
        const id = req.query.id as string;
        const { content } = req.body;
    
        try {
            const existingWorkflow = await WorkflowModel.findById(id);
    
            if (!existingWorkflow) {
                res.status(404).json({ error: 'Workflow not found' });
                return;
            }
    
            let nextVersionNumber = 1;
    
            if (existingWorkflow.versions.length > 0) {
                const latestVersion = existingWorkflow.versions[existingWorkflow.versions.length - 1];
                const latestVersionNumber = parseFloat(latestVersion.name);
    
                if (!isNaN(latestVersionNumber)) {
                    nextVersionNumber = Math.floor(latestVersionNumber) + 1;
                }
            }
    
            const nextVersionName = nextVersionNumber.toFixed(1);
    
            existingWorkflow.versions.push({
                name: nextVersionName,
                content,
                creationDate: new Date()
            });
    
            await existingWorkflow.save();
    
            res.status(200).json(existingWorkflow);
        } catch (error) {
            console.error('Error updating workflow:', error);
            res.status(500).json({ error: 'Failed to update workflow' });
        }
    };
    readonly paramsSaveName = {
        "name" : "string",
    }
    saveName = async (req: Request, res: Response): Promise<void> => {
        const id = req.query.id as string;
        const { name } = req.body;
    
        try {
            const existingWorkflow = await WorkflowModel.findById(id);
    
            if (!existingWorkflow) {
                res.status(404).json({ error: 'Workflow not found' });
                return;
            }
    
            existingWorkflow.set({name})
    
            await existingWorkflow.save();
    
            res.status(200).json(existingWorkflow);
        } catch (error) {
            console.error('Error updating workflow:', error);
            res.status(500).json({ error: 'Failed to update workflow' });
        }
    };

    deleteWorkflowVersion = async (req: Request, res: Response): Promise<void> => {
        const id = req.query.id as string;  
        const versionName = req.body.versionName;
    
        console.log('Delete Workflow Version Request Received');
        console.log('Workflow ID:', id);
        console.log('Version Name:', versionName);
    
        try {
            const existingWorkflow = await WorkflowModel.findById(id);
            
            console.log('Existing Workflow:', existingWorkflow);
    
            if (!existingWorkflow) {
                console.error('Workflow not found');
                res.status(404).json({ error: 'Workflow not found' });
                return;
            }
    
            const versionIndex = existingWorkflow.versions.findIndex(v => v.name === versionName);
            
            console.log('Version Index:', versionIndex);
    
            if (versionIndex === -1) {
                console.error('Version not found');
                res.status(404).json({ error: 'Version not found' });
                return;
            }
    
            console.log('Before Deletion - Versions:', existingWorkflow.versions);
    
            existingWorkflow.versions.splice(versionIndex, 1);
    
            console.log('After Deletion - Versions:', existingWorkflow.versions);
    
            await existingWorkflow.save();
            
            console.log('Workflow saved successfully');
    
            res.status(200).json(existingWorkflow);
        } catch (error) {
            console.error('Error deleting version:', error);
            res.status(500).json({ error: 'Failed to delete version' });
        }
    };
    deleteWorkflowById = async (req: Request, res: Response): Promise<void> => {
        const id = req.query.id as string;
        const username = req.user?.username;
    
        if (!id) {
            res.status(400).json({ message: 'workflow ID is required' });
            return;
        }
        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: 'Invalid workflow ID format' });
            return;
        }
    
        if (!username) {
            res.status(401).json({ message: 'You are not logged in' });
            return;
        }
    
        try {
            const workflow = await WorkflowModel.findById(id);
    
            if (!workflow) {
                res.status(404).json({ message: 'workflow not found' });
                return;
            }
    
            if (workflow.username === username) {
                await workflow.deleteOne();
                res.status(200).json({ message: `workflow ${id} deleted` });
                return;
            }else {
                res.status(401).json({ message: 'You are not the owner' });
            }
        } catch (error) {
            console.error('Error deleting post:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };
    isWorkflowDeletable = async (req: Request, res: Response): Promise<void> => {
        const id = req.query.id as string;
        const username = req.user?.username;
    
        if (!username) {
            res.status(401).json({ message: 'You are not logged in' });
            return;
        }
    
        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: 'Invalid Workflow ID format' });
            return;
        }
    
        try {
            const workflow = await WorkflowModel.findById(id);
    
            if (!workflow) {
                res.status(404).json({ message: 'Workflow not found' });
                return;
            }
    
            if (workflow.username === username) {
                res.status(200).json(true);
                return;
            }
    
            res.status(200).json(false);
        } catch (error) {
            console.error('Error retrieving workflow :', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };


    getOneWorkflow = async (req: Request, res: Response): Promise<void> => {
        const id = req.query.id as string;
    
        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: 'Invalid Workflow ID format' })
            return
        }
    
        try {
            const program = await WorkflowModel.findById(id)
    
            if (program) {
                res.status(200).json(program)
            } else {
                res.status(404).json({ message: 'Workflow not found' })
            }
        } catch (error) {
            console.error('Error retrieving Workflow:', error)
            res.status(500).json({ message: 'Internal server error' })
        }
    }

    getUserWorkflows = async (req: Request, res: Response): Promise<void> => {
        try {
            const username = req.query.username || req.user?.username;
            if (!username) {
                res.status(401).json({"message": "Unauthorized"});
                return;
            }

            const userPosts = await WorkflowModel.find({ username: username });
            res.status(200).json(userPosts);
        } catch (err) {
            res.status(500).json({"message": "An error occurred while retrieving workflows"});
        }
    }

    buildRouter = (): Router => {
        const router = express.Router()
        router.get('/', checkUserToken(), this.getAllWorkflows.bind(this))
        router.get('/one', checkUserToken(), this.getOneWorkflow.bind(this))
        router.get('/user', checkUserToken(), this.getUserWorkflows.bind(this))

        router.get('/is-deletable', checkUserToken(), this.isWorkflowDeletable.bind(this))
        router.post('/clone', express.json(), checkUserToken(), checkBody(this.cloneWorkflowParams), this.cloneWorkflow.bind(this))
        router.post('/', express.json(), checkUserToken(), checkBody(this.workflowsNewProgram), this.newWorkflow.bind(this))
        router.patch('/', express.json(), checkUserToken(), checkBody(this.paramsUpdateWorkflow), this.updateWorkflow.bind(this))
        router.patch('/upgrade', express.json(), checkUserToken(), checkBody(this.paramsUpdateWorkflow), this.upgradeWorkflow.bind(this))
        router.patch('/name', express.json(), checkUserToken(), checkBody(this.paramsSaveName), this.saveName.bind(this))
        router.patch('/delete/version', express.json(), checkUserToken(), this.deleteWorkflowVersion.bind(this))
        router.delete('/',express.json(),checkUserToken(), this.deleteWorkflowById.bind(this))
        return router
    }
}