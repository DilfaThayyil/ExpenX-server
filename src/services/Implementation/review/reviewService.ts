import { inject, injectable } from "tsyringe";
import { IReviewRepository } from "../../../repositories/Interface/IReviewRepository";
import { IReviewService } from "../../Interface/review/IReviewService";
import { IReview } from "../../../models/reviewSchema";

@injectable()
export default class ReviewService implements IReviewService {
  private _reviewRepository: IReviewRepository

  constructor(@inject('IReviewRepository') reviewRepository: IReviewRepository) {
    this._reviewRepository = reviewRepository
  }

  async createReview(advisorId: string, userId: string, rating: number, review: string): Promise<IReview> {
    const newReview = await this._reviewRepository.createReview(advisorId, userId, rating, review);
    return newReview
  }
  async fetchReviews(advisorId: string,page:number,limit:number): Promise<{reviews:IReview[] | IReview,totalPages:number}> {
    const {reviews,totalReviews} = await this._reviewRepository.fetchReviews(advisorId,page,limit);
    const totalPages = Math.ceil(totalReviews / limit)
    return {reviews,totalPages}
  }

  async addReplyToReview(reviewId: string, advisorId: string, text: string): Promise<IReview | null> {
    const review = await this._reviewRepository.addReplyToReview(reviewId, advisorId, text)
    return review
  }
}