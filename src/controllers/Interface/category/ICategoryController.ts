import { Request, Response } from 'express'

export interface ICategoryController {
    getCategories(req: Request, res: Response): Promise<Response>;
}