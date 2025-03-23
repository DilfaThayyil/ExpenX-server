import {Request,Response} from 'express'

export interface IGoalController{
    createGoal(req: Request, res:Response): Promise<Response>
    getGoalsById(req: Request, res:Response): Promise<Response>
    updateGoal(req: Request, res:Response): Promise<Response>
    deleteGoal(req: Request, res:Response): Promise<Response>
    updateGoalProgress(req: Request, res:Response): Promise<Response>
}