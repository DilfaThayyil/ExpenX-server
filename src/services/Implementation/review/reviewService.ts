import { inject, injectable } from "tsyringe";
import { IReviewRepository } from "../../../repositories/Interface/IReviewRepository";
import { IReviewService } from "../../Interface/review/IReviewService";
import { IReview } from "../../../models/reviewSchema";

@injectable()
export default class ReviewService implements IReviewService {
  private reviewRepository: IReviewRepository

  constructor(@inject('IReviewRepository') reviewRepository: IReviewRepository) {
    this.reviewRepository = reviewRepository
  }

  async createReview(advisorId: string, userId: string, rating: number, review: string): Promise<IReview> {
    const newReview = await this.reviewRepository.createReview(advisorId, userId, rating, review);
    return newReview
  }
  async fetchReviews(advisorId: string): Promise<IReview[]> {
    const reviews = await this.reviewRepository.fetchReviews(advisorId);
    return reviews
  }

  async addReplyToReview(reviewId: string, advisorId: string, text: string): Promise<IReview | null> {
    const review = await this.reviewRepository.addReplyToReview(reviewId, advisorId, text)
    return review
  }
}