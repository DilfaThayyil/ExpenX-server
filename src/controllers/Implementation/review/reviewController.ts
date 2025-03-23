import { Request, Response } from 'express'
import { IReviewController } from '../../Interface/review/IReviewController';
import { IReviewService } from '../../../services/Interface/review/IReviewService';
import { inject, injectable } from 'tsyringe';
import { HttpStatusCode } from '../../../utils/httpStatusCode';

@injectable()
export default class ReviewController implements IReviewController {
    private reviewService: IReviewService

    constructor(@inject('IReviewService') reviewService: IReviewService) {
        this.reviewService = reviewService
    }

    async createReview(req: Request, res: Response): Promise<Response> {
        try {
            const { advisorId, userId, rating, review } = req.body;
            const newReview = await this.reviewService.createReview(advisorId, userId, rating, review);
            return res.status(HttpStatusCode.CREATED).json({ success: true, data: newReview });
        } catch (error) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Error creating reviews : ", error })
        }
    }
}