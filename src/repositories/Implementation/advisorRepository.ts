/* eslint-disable @typescript-eslint/no-explicit-any */
import { Types } from 'mongoose';
import IAdvisor from '../../entities/advisorEntities';
import advisorSchema from '../../models/advisorSchema';
import Report, { IReport } from "../../models/reportSchema";
import reviewSchema, { IReview } from '../../models/reviewSchema';
import slotSchema, { Slot } from '../../models/slotSchema';
import { IAdvisorRepository } from '../Interface/IAdvisorRepository';



export default class AdvisorRepository implements IAdvisorRepository {
    async findUserByEmail(email: string): Promise<any> {
        return await advisorSchema.findOne({ email });
    }

    async createUser(userData: any): Promise<any> {
        return await advisorSchema.create(userData);
    }

    async updateUser(userData: any, email: string): Promise<any> {
        return await advisorSchema.findOneAndUpdate({ email }, userData, { new: true });
    }

    async fetchAdvisors(page: number, limit: number): Promise<{ users: IAdvisor[]; totalUsers: number }> {
        const skip = (page - 1) * limit;
        const [users, totalUsers] = await Promise.all([
            advisorSchema.find().skip(skip).limit(limit),
            advisorSchema.countDocuments(),
        ]);
        return { users, totalUsers };
    }

    async updateAdvisorStatus(email: string, isBlock: boolean): Promise<void> {
        await advisorSchema.updateOne({ email }, { $set: { isBlocked: isBlock } })
    }

    async createSlot(slot: Slot): Promise<Slot> {
        const result = await slotSchema.create(slot)
        return result
    }

    async findExistingSlot(date: string, startTime: string): Promise<boolean> {
        const result = await slotSchema.findOne({ date, startTime })
        return !!result
    }

    async fetchSlots(advisorId:string,page: number, limit: number): Promise<{ slots: Slot[] | Slot; totalSlots: number }> {
        const skip = (page - 1) * limit
        const [slots, totalSlots] = await Promise.all([
            slotSchema.find({ "advisorId._id": advisorId }).skip(skip).limit(limit),
            slotSchema.countDocuments()
        ])
        return { slots, totalSlots }
    }

    async findSlotById(slotId: string): Promise<Slot | null> {
        return await slotSchema.findById(slotId)
    }

    async updateSlot(slotId: string, slot: Slot): Promise<Slot | null> {
        return await slotSchema.findByIdAndUpdate(slotId, slot, { new: true })
    }

    async deleteSlot(slotId: string): Promise<boolean> {
        const result = await slotSchema.findByIdAndDelete(slotId);
        return !!result;
    }

    async findUserById(id: string): Promise<IAdvisor | null> {
        return await advisorSchema.findById(id)
    }

    async getBookedSlotsForAdvisor(advisorId: string, page: number, limit: number): Promise<{ bookedSlots: Slot[] | Slot; totalSlots: number }> {
        try {
            const skip = (page - 1) * limit
            const [bookedSlots, totalSlots] = await Promise.all([
                slotSchema
                    .find({ 'advisorId._id': advisorId, status: "Booked" })
                    .skip(skip)
                    .limit(limit)
                    .populate("bookedBy", "username email")
                    .exec(),

                slotSchema.countDocuments({ 'advisorId._id': advisorId, status: "Booked" })
            ]);
            return { bookedSlots, totalSlots };
        } catch (err) {
            throw err
        }
    }


    async fetchReports(page: number, limit: number): Promise<{ reports: IReport[], totalReports: number }> {
        const skip = (page - 1) * limit;
        const [reports, totalReports] = await Promise.all([
            Report.find()
                .populate("userId", "username email isBlocked")
                .populate("advisorId", "username email isBlocked")
                .sort({ createdAt: -1 }).skip(skip).limit(limit),
            Report.countDocuments()
        ])
        return { reports, totalReports };
    }

    async fetchReviews(advisorId: string): Promise<IReview[]> {
        const reviews = await reviewSchema
            .find({ advisorId: new Types.ObjectId(advisorId) })
            .populate('userId', 'username profilePic')
            .sort({ createdAt: -1 });
        return reviews
    }

    async findUserByRefreshToken(refreshToken: string): Promise<any> {
        return await advisorSchema.findOne({ refreshToken });
    }

    async updateRefreshToken(refreshToken: string, email: string): Promise<any> {
        return await advisorSchema.findOneAndUpdate({ email }, { refreshToken }, { new: true });
    }

    async removeRefreshToken(email: string): Promise<any> {
        return await advisorSchema.findOneAndUpdate({ email }, { refreshToken: null }, { new: true });
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
