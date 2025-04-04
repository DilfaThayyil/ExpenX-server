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

    async fetchReviews(advisorId: string, page: number, limit: number): Promise<{ reviews: IReview[]; totalReviews: number }> {
        try {
            if (!Types.ObjectId.isValid(advisorId)) {
                throw new Error('Invalid advisor ID'); 
            }
            const skip = (page - 1) * limit;
            const [reviews, totalReviews] = await Promise.all([
                reviewSchema
                    .find({ advisorId: new Types.ObjectId(advisorId) })
                    .skip(skip)
                    .limit(limit)
                    .populate('userId', 'username profilePic')
                    .sort({ createdAt: -1 })
                    .exec(),
                reviewSchema.countDocuments({ advisorId: new Types.ObjectId(advisorId) }) 
            ]);
            return { reviews, totalReviews }; 
        } catch (err) {
            throw err;
        }
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