import { IReview } from "../../../models/reviewSchema";

export interface IReviewService{
    createReview(advisorId: string, userId: string, rating: number, review: string): Promise<IReview>;
    fetchReviews(advisorId:string):Promise<IReview[]>
    addReplyToReview(reviewId:string,advisorId:string,text:string):Promise<IReview | null>
}