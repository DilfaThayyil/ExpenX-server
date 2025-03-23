import {Request,Response} from 'express'

export interface IReviewController{
    createReview(req: Request, res:Response): Promise<Response>

}