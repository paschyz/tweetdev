import { Request, RequestHandler } from "express";

export function checkBody(params: Record<string, string>): RequestHandler{
    return async (req: Request, res, next) => {
        
        if(!req.body){
            console.log("There is no body")
            res.status(400).end()
            return 
        }

        for (let param of Object.keys(params)){
            let type = params[param]

            if (!(param in req.body )&& !type.includes('undefined')){
                console.log(`${param} is missing`)
                res.status(400).end()
                return
            }

            if ( !type.includes(typeof req.body[param])){
                console.log(`${param} not the right type, now it's ${typeof req.body[param]} must be ${type}`);
                
                res.status(400).end()
                return
            }
               
        }
    
        next()

    }
}