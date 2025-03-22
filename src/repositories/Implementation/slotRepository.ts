import { Types } from "mongoose";
import slotSchema, { Slot } from "../../models/slotSchema";
import { ISlotRepository } from "../Interface/ISlotRepository";
import { BaseRepository } from "./baseRepository";

export default class SlotRepository extends BaseRepository<Slot>implements ISlotRepository
{
    constructor(){
        super(slotSchema)
    }
    async findSlot(slotId: string): Promise<Slot | null> {
        return await slotSchema.findById(slotId)
    }
    async bookSlot(slotId: string, slot: Slot): Promise<Slot | null> {
        const bookedSlot = await slotSchema.findOneAndUpdate({ _id: slotId }, slot, { new: true })
        return bookedSlot
    }
    async updateSlot(slotId: string): Promise<Slot | null> {
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
}