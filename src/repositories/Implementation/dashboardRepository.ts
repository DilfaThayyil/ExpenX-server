import { IAdvDashboardRepo } from "../Interface/IDashboardRepository";
import { Types } from 'mongoose';
import Payment from "../../models/paymentSchema";
import goalsSchema from '../../models/goalsSchema';
import SlotModel from "../../models/slotSchema";
import slotSchema, { Slot } from '../../models/slotSchema';
import { IAppointment } from "../../dto/advisorDTO";

export default class AdvDashboardRepo implements IAdvDashboardRepo {
    async getDashboardData(advisorId: string): Promise<{
        totalRevenue: number;
        activeClients: number;
        completedGoals: number;
        slotUtilization: number;
    }> {
        const [totalRevenue, activeClients, completedGoals, slotUtilization] =
            await Promise.all([
                this.getTotalRevenue(advisorId),
                this.getActiveClients(advisorId),
                this.getCompletedGoals(advisorId),
                this.getSlotUtilization(advisorId),
            ]);
        console.log("getDashBoardData - repo  : ", { totalRevenue, activeClients, completedGoals, slotUtilization })
        return { totalRevenue, activeClients, completedGoals, slotUtilization };
    }

    async getTotalRevenue(advisorId: string): Promise<number> {
        const result = await Payment.aggregate([
            { $match: { advisorId: new Types.ObjectId(advisorId) } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        return result.length > 0 ? result[0].total : 0;
    }

    async getActiveClients(advisorId: string): Promise<number> {
        const activeClients = await SlotModel.distinct("bookedBy._id", {
            "advisorId._id": new Types.ObjectId(advisorId),
            status: "Booked"
        });
        return activeClients.length;
    }

    async getCompletedGoals(advisorId: string): Promise<number> {
        const clientIds = await SlotModel.distinct("bookedBy._id", {
            "advisorId._id": new Types.ObjectId(advisorId),
            status: "Booked"
        });
        if (clientIds.length === 0) return 0;
        const completedGoals = await goalsSchema.countDocuments({
            userId: { $in: clientIds },
            status: "completed"
        });
        return completedGoals;
    }

    async getSlotUtilization(advisorId: string): Promise<number> {
        const totalSlots = await SlotModel.countDocuments({
            "advisorId._id": new Types.ObjectId(advisorId),
        });
        const bookedSlots = await SlotModel.countDocuments({
            "advisorId._id": new Types.ObjectId(advisorId),
            status: "Booked",
        });
        return totalSlots > 0 ? (bookedSlots / totalSlots) * 100 : 0;
    }

    async fetchRevenue(advisorId: string, timeframe: "monthly" | "quarterly" | "yearly"): Promise<number> {
        let startDate = new Date();

        if (timeframe === "monthly") {
            startDate.setMonth(startDate.getMonth() - 1);
        } else if (timeframe === "quarterly") {
            startDate.setMonth(startDate.getMonth() - 3);
        } else if (timeframe === "yearly") {
            startDate.setFullYear(startDate.getFullYear() - 1);
        }
        const totalRevenue = await Payment.aggregate([
            {
                $match: {
                    advisorId: new Types.ObjectId(advisorId),
                    status: "completed",
                    createdAt: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$amount" }
                }
            }
        ]);
        console.log("fetchRevenue : ", totalRevenue.length > 0 ? totalRevenue[0].totalRevenue : 0);
        return totalRevenue.length > 0 ? totalRevenue[0].totalRevenue : 0;
    }


    async getClientGoalProgress(advisorId: string): Promise<{ completed: number; inProgress: number; notStarted: number }> {
        try {
            const bookedSlots = await slotSchema.find({
                "advisorId._id": new Types.ObjectId(advisorId),
                status: "Booked"
            }).select("bookedBy");
            const clientIds = bookedSlots
                .map(slot => {
                    if (slot.bookedBy && "_id" in slot.bookedBy) {
                        return (slot.bookedBy as { _id: Types.ObjectId })._id.toString();
                    }
                    return null;
                })
                .filter((id): id is string => id !== null);
            if (clientIds.length === 0) {
                return { completed: 0, inProgress: 0, notStarted: 0 };
            }
            const goalStats = await goalsSchema.aggregate([
                { $match: { userId: { $in: clientIds.map(id => new Types.ObjectId(id)) } } },
                {
                    $group: {
                        _id: "$status",
                        count: { $sum: 1 }
                    }
                }
            ])
            const result = {
                completed: 0,
                inProgress: 0,
                notStarted: 0,
            };
            goalStats.forEach((stat: { _id: "completed" | "inProgress" | "notStarted"; count: number }) => {
                result[stat._id] = stat.count;
            });
            console.log("Goal Progress:", result);
            return result;
        } catch (error) {
            console.error("Error fetching goal progress:", error);
            throw new Error("Failed to fetch goal progress");
        }
    }

    async getUpcomingAppointments(advisorId: string): Promise<IAppointment[]> {
        const currentDate = new Date().toISOString().split("T")[0];

        const slots = await SlotModel.find({
            "advisorId._id": new Types.ObjectId(advisorId), // Ensure ObjectId is used
            date: { $gte: currentDate },
            status: "Booked",
        })
            .sort({ date: 1, startTime: 1 })
            .lean();

        return slots.map(slot => ({
            _id: slot._id.toString(), // Convert ObjectId to string
            advisorId:
                slot.advisorId && "_id" in slot.advisorId // Type guard to check if it's not an empty object
                    ? {
                        _id: slot.advisorId._id.toString(),
                        username: slot.advisorId.username,
                        email: slot.advisorId.email,
                        profilePic: slot.advisorId.profilePic,
                    }
                    : { _id: "", username: "", email: "", profilePic: "", },

            date: slot.date,
            startTime: slot.startTime,
            fee: slot.fee,
            duration: slot.duration,
            maxBookings: slot.maxBookings,
            status: slot.status,

            bookedBy:
                slot.bookedBy && "_id" in slot.bookedBy
                    ? {
                        _id: slot.bookedBy._id.toString(),
                        username: slot.bookedBy.username,
                        email: slot.bookedBy.email,
                        profilePic: slot.bookedBy.profilePic,
                    }
                    : undefined,

            location: slot.location,
            locationDetails: slot.locationDetails,
            description: slot.description,
        }));
    }

    async getRecentClientActivities(advisorId: string, limit: number = 5):Promise<Slot[]> {
        try {
            const activities = await SlotModel.find({
                "advisorId._id": new Types.ObjectId(advisorId),
                "bookedBy._id": { $exists: true, $ne: null }
            })
                .sort({ createdAt: -1 })
                .limit(limit)
                .lean();
            console.log("recentClientActivities-repo : ",activities)
            return activities;
        } catch (error) {
            console.error("Error fetching recent client activities:", error);
            throw error;
        }
    }
}