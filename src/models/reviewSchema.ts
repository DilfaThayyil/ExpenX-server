import mongoose, { Schema } from 'mongoose';

export interface IReview{
  advisorId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  rating: number;
  review: string;
  createdAt: Date;
  replies: Array<{
    userId: mongoose.Types.ObjectId;
    text: string;
    createdAt: Date;
  }>;
}

const ReplySchema = new Schema({
  advisorId: { type: Schema.Types.ObjectId, ref: 'Advisor'},
  text: { type: String},
  createdAt: { type: Date, default: Date.now }
});

const ReviewSchema = new Schema({
  advisorId: { type: Schema.Types.ObjectId, ref: 'Advisor'},
  userId: { type: Schema.Types.ObjectId, ref: 'User'},
  rating: { type: Number, required: true, min: 1, max: 5 },
  review: { type: String},
  createdAt: { type: Date, default: Date.now },
  replies: [ReplySchema]
});

export default mongoose.model<IReview>('Review', ReviewSchema);