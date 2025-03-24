import { Request, Response } from "express"

export interface IAdminController{
    adminLogin(req:Request, res:Response):Promise<Response>
    updateAdmin(req:Request, res:Response):Promise<void>
    adminLogout(req:Request, res:Response): Promise<Response>
    getMonthlyTrends(req:Request, res:Response): Promise<Response>
    getExpenseCategories(req:Request,res:Response): Promise<Response>
    getDashboardStats(req:Request,res:Response): Promise<Response>
    getUserGrowth(req:Request,res:Response): Promise<Response>
}