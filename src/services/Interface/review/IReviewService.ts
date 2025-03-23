import { IReview } from "../../../models/reviewSchema";

export interface IReviewService{
    createReview(advisorId: string, userId: string, rating: number, review: string): Promise<IReview>;

}