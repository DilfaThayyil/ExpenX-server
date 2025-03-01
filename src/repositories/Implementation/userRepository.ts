import { IUserRepository } from '../Interface/IUserRepository';
import userSchema from '../../models/userSchema';
import { IExpense } from '../../entities/expenseEntities';
import expenseSchema from '../../models/expenseSchema';
import groupSchema from '../../models/groupSchema';
import IUser from '../../entities/userEntities';
import slotSchema, { Slot } from '../../models/slotSchema';
import { Types } from 'mongoose';
import { GroupMember, IGroup, IGroupExpense } from '../../entities/groupEntities';
import reportSchema, { IReport } from '../../models/reportSchema';
import Report from '../../models/reportSchema';


export default class UserRepository implements IUserRepository {

    async findUserByEmail(email: string): Promise<any> {
        return await userSchema.findOne({ email });
    }

    async createUser(userData: any): Promise<any> {
        return await userSchema.create(userData);
    }

    async updateUser(userData: any, email: string): Promise<any> {
        return await userSchema.findOneAndUpdate({ email }, userData, { new: true });
    }

    async findExpensesByUserId(userId: string): Promise<IExpense[]> {
        const expense = await expenseSchema.find({ userId });
        return expense
    }

    async createExpense(expenseData: IExpense): Promise<IExpense> {
        return expenseSchema.create(expenseData);
    }

    async createGroup(groupData: IGroup): Promise<IGroup> {
        return groupSchema.create(groupData)
    }

    async getUserGroups(email: string): Promise<IGroup[]> {
        const groups = await groupSchema.find({ members: { $elemMatch: { email } } });
        return groups
    }

    async fetchUsers(page: number, limit: number): Promise<{ users: IUser[]; totalUsers: number }> {
        const skip = (page - 1) * limit;
        const [users, totalUsers] = await Promise.all([
            userSchema.find({ isAdmin: false }).skip(skip).limit(limit),
            userSchema.countDocuments({ isAdmin: false }),
        ]);

        return { users, totalUsers };
    }


    async findAdmin(): Promise<any> {
        return await userSchema.findOne({ isAdmin: true })
    }

    async updateAdmin(admin: any): Promise<any> {
        return await userSchema.findOneAndUpdate({ isAdmin: true }, admin, { new: true });
    }

    async updateUserStatus(email: string, isBlock: boolean): Promise<void> {
        await userSchema.updateOne({ email }, { $set: { isBlocked: isBlock } })
    }

    async findById(groupId: string): Promise<IGroup | null> {
        return await groupSchema.findById(groupId).populate("expenses")
    }

    async addMember(groupId: string, newMember: GroupMember): Promise<IGroup> {
        const group = await groupSchema.findByIdAndUpdate(
            groupId,
            { $addToSet: { members: newMember } },
            { new: true }
        )
        if (!group) {
            throw new Error('group not found')
        }
        return group
    }

    async findByEmail(email: string): Promise<IUser | null> {
        const user = await userSchema.findOne({ email });
        return user
    }    

    async addExpenseInGroup(groupId: string, expense: IGroupExpense): Promise<IGroup> {
        const updatedGroup = await groupSchema.findByIdAndUpdate(
            new Types.ObjectId(groupId),
            { $push: { expenses: expense } },
            { new: true }
        )
        if (!updatedGroup) {
            throw new Error('group not found')
        }
        return updatedGroup
    }

    async findSlot(slotId: string): Promise<Slot | null> {
        return await slotSchema.findById(slotId)
    }

    async findUserById(userId: string): Promise<IUser | null> {
        return await userSchema.findById(userId)
    }

    async bookSlot(slotId: string, slot: Slot): Promise<Slot | null> {
        const bookedSlot = await slotSchema.findOneAndUpdate({ _id: slotId }, slot, { new: true })
        return bookedSlot
    }
    async createReport(data: IReport): Promise<IReport> {
        const report = await Report.create(data);
        return report;
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
        } catch (error:any) {
          throw new Error(`Error fetching slots: ${error.message}`);
        }
      }
    
    
    async findUserByRefreshToken(refreshToken: string): Promise<any> {
        return await userSchema.findOne({ refreshToken })
    }

    async updateRefreshToken(refreshToken: string, email: string): Promise<any> {
        return await userSchema.findOneAndUpdate({ email }, { refreshToken }, { new: true })
    }

    async findUserByPhoneNumber(phoneNumber: string): Promise<any> {
        return await userSchema.findOne({ phoneNumber })
    }

    async removeRefreshToken(email: string): Promise<any> {
        return await userSchema.findOneAndUpdate({ email }, { refreshToken: null }, { new: true })
    }



}
