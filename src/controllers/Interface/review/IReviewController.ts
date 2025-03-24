import {Request,Response} from 'express'

export interface IReviewController{
    createReview(req: Request, res:Response): Promise<Response>
    fetchReviews(req: Request, res: Response): Promise<Response>
    addReplyToReview(req: Request, res: Response): Promise<Response>
}