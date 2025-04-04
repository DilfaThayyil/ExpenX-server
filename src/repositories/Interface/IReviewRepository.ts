import { IReview } from "../../models/reviewSchema";

export interface IReviewRepository{
    createReview(advisorId: string, userId: string, rating: number, review: string): Promise<IReview>
    fetchReviews(advisorId:string,page:number,limit:number):Promise<{reviews : IReview[] | IReview ; totalReviews:number}>
    addReplyToReview(reviewId:string,advisorId:string,text:string):Promise<IReview | null>
}