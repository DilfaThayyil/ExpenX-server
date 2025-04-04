import { IReview } from "../../../models/reviewSchema";

export interface IReviewService{
    createReview(advisorId: string, userId: string, rating: number, review: string): Promise<IReview>;
    fetchReviews(advisorId:string,page:number,limit:number):Promise<{reviews:IReview[] | IReview;totalPages:number}>
    addReplyToReview(reviewId:string,advisorId:string,text:string):Promise<IReview | null>
}