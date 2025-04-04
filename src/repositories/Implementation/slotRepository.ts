import { Types } from "mongoose";
import slotSchema, { Slot } from "../../models/slotSchema";
import { ISlotRepository } from "../Interface/ISlotRepository";
import { BaseRepository } from "./baseRepository";

export default class SlotRepository extends BaseRepository<Slot> implements ISlotRepository {
    constructor() {
        super(slotSchema)
    }
    async findSlot(slotId: string): Promise<Slot | null> {
        return await this.findById(slotId)
    }
    async bookSlot(slotId: string, slot: Slot): Promise<Slot | null> {
        const bookedSlot = await slotSchema.findOneAndUpdate({ _id: slotId }, slot, { new: true })
        return bookedSlot
    }
    async updateSlotStatus(slotId: string): Promise<Slot | null> {
        return await slotSchema.findOneAndUpdate({ _id: slotId }, { status: "Cancelled" }, { new: true })
    }
    async fetchSlotsByUser(userId: string, page: number, limit: number): Promise<{ slots: Slot[], totalPages: number }> {
        try {
            const userObjectId = new Types.ObjectId(userId);
            const filter = {
                $or: [{ "bookedBy._id": userObjectId }, { status: "Available" }],
            };
            const totalSlots = await slotSchema.countDocuments(filter);
            const totalPages = Math.ceil(totalSlots / limit);
            const slots = await slotSchema.find(filter)
                .skip((page - 1) * limit)
                .limit(limit)
                .sort({ date: 1 })
                .lean();
            return { slots, totalPages };
        } catch (error: any) {
            throw new Error(`Error fetching slots: ${error.message}`);
        }
    }

    async createSlot(slot: Slot): Promise<Slot> {
        const result = await this.create(slot)
        return result
    }

    async findExistingSlot(date: string, startTime: string): Promise<boolean> {
        const result = await slotSchema.findOne({ date, startTime })
        return !!result
    }

    async fetchSlots(advisorId: string, page: number, limit: number): Promise<{ slots: Slot[] | Slot; totalSlots: number }> {
        const skip = (page - 1) * limit
        const [slots, totalSlots] = await Promise.all([
            slotSchema.find({ "advisorId._id": advisorId }).skip(skip).limit(limit),
            slotSchema.countDocuments()
        ])
        return { slots, totalSlots }
    }

    async findSlotById(slotId: string): Promise<Slot | null> {
        return await this.findById(slotId)
    }

    async updateSlot(slotId: string, slot: Slot): Promise<Slot | null> {
        return await slotSchema.findByIdAndUpdate(slotId, slot, { new: true })
    }

    async deleteSlot(slotId: string): Promise<boolean> {
        const result = await slotSchema.findByIdAndDelete(slotId);
        return !!result;
    }

    async getBookedSlotsForAdvisor(advisorId: string, page: number, limit: number): Promise<{ bookedSlots: Slot[] | Slot; totalSlots: number }> {
        // eslint-disable-next-line no-useless-catch
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

    async getClientMeetings(clientId: string, advisorId: string): Promise<Slot[]> {
        try {
            const clientMeetings = await this.model.find({
                "bookedBy._id": clientId,
                "advisorId._id": advisorId
            }).exec();
            console.log("meetings-repo : ",clientMeetings)
            return clientMeetings;
        } catch (error) {
            console.error("Error fetching client meetings:", error);
            throw error;
        }
    }

}