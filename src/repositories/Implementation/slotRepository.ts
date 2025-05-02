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
        return await slotSchema.findOneAndUpdate(
            { _id: slotId, status: 'Available' },
            {
                $set: {
                    ...slot,
                    status: 'Booked'
                }
            },
            { new: true }
        );
    }

    async updateSlotStatus(slotId: string): Promise<Slot | null> {
        return await slotSchema.findOneAndUpdate({ _id: slotId }, { status: "Cancelled" }, { new: true })
    }

    async fetchSlotsByUser(userId: string, page: number, limit: number): Promise<{ slots: Slot[], totalPages: number }> {
        try {
            const userObjectId = new Types.ObjectId(userId);
            const filter = {
                $or: [{ "bookedBy": userObjectId }, { status: "Available" }],
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

    async fetchSlots(advisorId: string, page: number, limit: number, search: string): Promise<{ slots: Slot[] | Slot; totalSlots: number }> {
        const skip = (page - 1) * limit
        const query: any = {
            "advisorId": new Types.ObjectId(advisorId)
        };
        if (search) {
            const searchRegex = new RegExp(search, "i");
            query.$or = [
                { description: { $regex: searchRegex } },
                { locationDetails: { $regex: searchRegex } },
                { status: { $regex: searchRegex } }
            ];
        }
        const [slots, totalSlots] = await Promise.all([
            slotSchema.find(query).skip(skip).limit(limit),
            slotSchema.countDocuments(query)
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

    async getBookedSlotsForAdvisor(
        advisorId: string,
        page: number,
        limit: number,
        search: string
    ): Promise<{ bookedSlots: any[]; totalSlots: number }> {
        try {
            const skip = (page - 1) * limit;
            const matchStage: any = {
                advisorId: new Types.ObjectId(advisorId),
                status: 'Booked',
            };
            const searchRegex = new RegExp(search, 'i');

            const pipeline: any[] = [
                { $match: matchStage },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'bookedBy',
                        foreignField: '_id',
                        as: 'bookedBy'
                    }
                },
                { $unwind: '$bookedBy' },
            ];

            if (search) {
                pipeline.push({
                    $match: {
                        $or: [
                            { 'bookedBy.username': { $regex: searchRegex } },
                            { 'bookedBy.email': { $regex: searchRegex } }
                        ]
                    }
                });
            }

            pipeline.push({
                $facet: {
                    paginatedResults: [
                        { $skip: skip },
                        { $limit: limit },
                        {
                            $project: {
                                _id: 1,
                                advisorId: 1,
                                date: 1,
                                startTime: 1,
                                fee: 1,
                                duration: 1,
                                location: 1,
                                locationDetails: 1,
                                description: 1,
                                status: 1,
                                createdAt: 1,
                                updatedAt: 1,
                                bookedBy: {
                                    _id:1,
                                    username: 1,
                                    email: 1,
                                    profilePic: 1
                                }
                            }
                        }
                    ],
                    totalCount: [
                        { $count: 'count' }
                    ]
                }
            });

            const result = await slotSchema.aggregate(pipeline);
            const bookedSlots = result[0]?.paginatedResults || [];
            const totalSlots = result[0]?.totalCount[0]?.count || 0;
            return { bookedSlots, totalSlots };
        } catch (err) {
            console.error('Error in getBookedSlotsForAdvisor:', err);
            throw err;
        }
    }


    async getClientMeetings(clientId: string, advisorId: string): Promise<Slot[]> {
        try {
            const clientMeetings = await this.model.find({
                "bookedBy._id": clientId,
                "advisorId._id": advisorId
            }).exec();
            return clientMeetings;
        } catch (error) {
            console.error("Error fetching client meetings:", error);
            throw error;
        }
    }

}