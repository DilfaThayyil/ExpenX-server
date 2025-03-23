import {Request,Response} from 'express'

export interface IGroupController{
    createGroup(req: Request, res: Response): Promise<Response>
    getUserGroups(req: Request, res:Response): Promise<Response>
    addMember(req: Request, res:Response): Promise<void>
    addExpenseInGroup(req: Request, res:Response): Promise<Response>
}