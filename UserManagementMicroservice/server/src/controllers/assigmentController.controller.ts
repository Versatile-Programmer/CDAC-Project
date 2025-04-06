
import {Request,Response} from "express"

export const assignmentController = async (req:Request, res:Response):Promise<void> => {
    try{
        const body = req.body;
        
        res.status(200).json({message:"Success"})
        return;
    }catch(error){
        res.status(500).json({message:"Error"})
        return;
    }
}