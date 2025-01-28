import { Request, Response } from "express"

export interface IAdminController{
    adminLogin(req:Request, res:Response):Promise<Response>
    fetchUsers(req:Request, res:Response):Promise<Response>
    fetchAdvisors(req:Request, res:Response):Promise<Response>
    updateAdmin(req:Request, res:Response):Promise<void>
}