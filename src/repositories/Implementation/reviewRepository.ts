import { Types } from "mongoose";
import reviewSchema, { IReview } from "../../models/reviewSchema";
import { IReviewRepository } from "../Interface/IReviewRepository";
import { BaseRepository } from "./baseRepository";

export default class ReviewRepository extends BaseRepository<IReview> implements IReviewRepository{
    constructor(){
        super(reviewSchema)
    }
    async createReview(advisorId: string, userId: string, rating: number, review: string): Promise<IReview> {
        const newReview = await reviewSchema.create({
            advisorId: new Types.ObjectId(advisorId),
            userId: new Types.ObjectId(userId),
            rating,
            review
        });
        return newReview
    }
}