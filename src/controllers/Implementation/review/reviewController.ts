import { Request, Response } from 'express'
import { IReviewController } from '../../Interface/review/IReviewController';
import { IReviewService } from '../../../services/Interface/review/IReviewService';
import { inject, injectable } from 'tsyringe';
import { HttpStatusCode } from '../../../utils/httpStatusCode';

@injectable()
export default class ReviewController implements IReviewController {
    private _reviewService: IReviewService

    constructor(@inject('IReviewService') reviewService: IReviewService) {
        this._reviewService = reviewService
    }

    async createReview(req: Request, res: Response): Promise<Response> {
        try {
            const { advisorId, userId, rating, review } = req.body;
            const newReview = await this._reviewService.createReview(advisorId, userId, rating, review);
            return res.status(HttpStatusCode.CREATED).json({ success: true, data: newReview });
        } catch (error) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Error creating reviews : ", error })
        }
    }


    async fetchReviews(req: Request, res: Response): Promise<Response> {
        try {
            const { advisorId } = req.params;
            const page = parseInt(req.query.page as string) || 1
            const limit = parseInt(req.query.limit as string) || 1
            const {reviews,totalPages} = await this._reviewService.fetchReviews(advisorId,page,limit);
            return res.status(HttpStatusCode.OK).json({ success: true, data: {reviews,totalPages} });
        } catch (error) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: 'Error fetching reviews' })
        }
    }

    async addReplyToReview(req: Request, res: Response): Promise<Response> {
        try {
            const { reviewId } = req.params
            const { advisorId, text } = req.body
            const review = await this._reviewService.addReplyToReview(reviewId, advisorId, text)
            return res.status(HttpStatusCode.OK).json({ success: true, data: review })
        } catch (err) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: 'Error adding review' })
        }
    }
}