import { Request, Response } from "express"

export interface IAdminController{
    adminLogin(req:Request, res:Response):Promise<Response>
    fetchUsers(req:Request, res:Response):Promise<Response>
    fetchAdvisors(req:Request, res:Response):Promise<Response>
    updateAdmin(req:Request, res:Response):Promise<void>
    updateUserBlockStatus(req:Request, res:Response):Promise<Response>
    updateAdvisorBlockStatus(req:Request, res:Response):Promise<Response>
    fetchCategories(req:Request, res:Response):Promise<Response>
    addCategory(req:Request, res:Response):Promise<Response>
    updateCategory(req:Request, res:Response):Promise<Response>
    deleteCategory(req:Request, res:Response):Promise<Response>
}