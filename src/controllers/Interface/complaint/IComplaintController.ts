import {Request,Response} from 'express'

export interface IComplaintController{
    reportAdvisor(req:Request, res:Response): Promise<Response> 

}