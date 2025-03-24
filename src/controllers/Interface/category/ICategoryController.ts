import { Request, Response } from 'express'

export interface ICategoryController {
    getCategories(req: Request, res: Response): Promise<Response>;
    fetchCategories(req:Request, res:Response):Promise<Response>
    addCategory(req:Request, res:Response):Promise<Response>
    updateCategory(req:Request, res:Response):Promise<Response>
    deleteCategory(req:Request, res:Response):Promise<Response>
}