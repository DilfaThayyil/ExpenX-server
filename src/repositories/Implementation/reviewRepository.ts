import { Types } from "mongoose";
import reviewSchema, { IReview } from "../../models/reviewSchema";
import { IReviewRepository } from "../Interface/IReviewRepository";
import { BaseRepository } from "./baseRepository";

export default class ReviewRepository extends BaseRepository<IReview> implements IReviewRepository {
    constructor() {
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
    
    async fetchReviews(advisorId: string): Promise<IReview[]> {
        const reviews = await reviewSchema
            .find({ advisorId: new Types.ObjectId(advisorId) })
            .populate('userId', 'username profilePic')
            .sort({ createdAt: -1 });
        return reviews
    }

    async addReplyToReview(reviewId: string, advisorId: string, text: string): Promise<IReview | null> {
        const review = await reviewSchema.findByIdAndUpdate(
            reviewId,
            {
                $push: {
                    replies: {
                        advisorId: new Types.ObjectId(advisorId),
                        text,
                        createdAt: new Date()
                    }
                }
            },
            { new: true }
        ).populate('replies.advisorId', 'username profilePic');
        return review
    }

}