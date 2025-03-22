import { IReview } from "../../models/reviewSchema";

export interface IReviewRepository{
    createReview(advisorId: string, userId: string, rating: number, review: string): Promise<IReview>

}