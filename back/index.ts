import * as express from 'express'
import * as mongoose from 'mongoose'
import * as morgan from "morgan"

import { Response, Request } from "express"
import listEndpoints = require('express-list-endpoints')
import { AuthController, UserController, ProgramController, WorkflowController,CommentController } from './controller'
import { StartService } from './service'
import { PostController } from './controller/post.controller'
import { HubController } from './controller/hub.controller'

const cors = require('cors');
import * as dotenv from "dotenv";
dotenv.config({ path:'.env' });
const FRONT_URL = process.env.FRONT_BASE_URL;
const FRONT_BASE_URL_PROD = process.env.FRONT_BASE_URL_PROD;
const startServer = async (): Promise<void> => {

    const connection = await mongoose.connect(process.env.MONGODB_URI as string, {auth: {
            username: process.env.MONGODB_USER as string,
            password: process.env.MONGODB_PASSWORD as string
        },
        authSource: "admin"
    })

    await StartService.userRoles()
    
    const app = express()
    const corsOptions = {
        origin: [FRONT_URL, FRONT_BASE_URL_PROD],
    };
    app.use(cors(corsOptions));
  

    app.use(morgan("short"))
    app.get('/', (req, res) => {
        const response = { message: 'Server is up' };
        res.json(response);
      });
      
    
    const userController = new UserController()
    const authController = new AuthController() 
    const postController = new PostController()
    const hubController = new HubController()
    const programController = new ProgramController()
    const workflowController = new WorkflowController()
    const commentController = new CommentController()

    await StartService.createUsers()
    await StartService.seed()

    // await StartService.createUser()
    app.use(userController.path, userController.buildRouter())
    app.use(authController.path, authController.buildRouter())
    app.use(postController.path, postController.buildRouter())
    app.use(hubController.path, hubController.buildRouter())
    app.use(programController.path, programController.buildRouter())
    app.use(workflowController.path, workflowController.buildRouter())
    app.use(commentController.path, commentController.buildRouter())


    app.listen(process.env.PORT, () => {
        console.log(`Server up on PORT : ${process.env.PORT}`)
    })

    console.table(listEndpoints(app))

}
startServer().catch((err) => {
    console.error(err)
})
