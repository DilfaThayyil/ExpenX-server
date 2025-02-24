import { IUserRepository } from '../Interface/IUserRepository';
import userSchema from '../../models/userSchema';
import { IExpense } from '../../entities/expenseEntities';
import expenseSchema from '../../models/expenseSchema';
import groupSchema from '../../models/groupSchema';
import IUser from '../../entities/userEntities';
import slotSchema, { Slot } from '../../models/slotSchema';
import mongoose, { Types } from 'mongoose';
import { GroupMember, IGroup, IGroupExpense } from '../../entities/groupEntities';


export default class UserRepository implements IUserRepository {

    async findUserByEmail(email: string): Promise<any> {
        console.log("finding....")
        return await userSchema.findOne({ email });
    }

    async createUser(userData: any): Promise<any> {
        console.log("vanuuuu");
        console.log(userData, 'dfghjngvvhh');

        return await userSchema.create(userData);
    }

    async updateUser(userData: any, email: string): Promise<any> {
        return await userSchema.findOneAndUpdate({ email }, userData, { new: true });
    }

    async findExpensesByUserId(userId: string): Promise<IExpense[]> {
        console.log("userId from repository: ", userId)
        const expense = await expenseSchema.find({ userId });
        console.log("expense from repo : ", expense)
        return expense
    }

    async createExpense(expenseData: IExpense): Promise<IExpense> {
        return expenseSchema.create(expenseData);
    }

    async createGroup(groupData: IGroup): Promise<IGroup> {
        console.log("repo calling...")
        console.log("groupData in repo : ", groupData)
        return groupSchema.create(groupData)
    }

    async getUserGroups(email: string): Promise<IGroup[]> {
        const groups = await groupSchema.find({ members: { $elemMatch: { email } } });
        console.log("groups-repo : ", JSON.stringify(groups, null, 2));
        return groups
    }

    async fetchUsers(page: number, limit: number): Promise<{ users: IUser[]; totalUsers: number }> {
        const skip = (page - 1) * limit;
        console.log("Fetching users, skip:", skip);

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
        console.log("admin-repo : ", admin)
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
        console.log("expense-repo : ",expense)
        const updatedGroup = await groupSchema.findByIdAndUpdate(
            new Types.ObjectId(groupId),
            { $push: { expenses: expense } },
            { new: true }
        )
        if (!updatedGroup) {
            throw new Error('group not found')
        }
        console.log("****updatedGroup-repo**** : ",updatedGroup)
        return updatedGroup
    }

    async findSlot(slotId: string): Promise<Slot | null> {
        return await slotSchema.findById(slotId)
    }

    async findUserById(userId: string): Promise<IUser | null> {
        return await userSchema.findById(userId)
    }

    async bookSlot(slotId: string, slot: Slot): Promise<Slot | null> {
        console.log("slotId-repo :", slotId)
        console.log("slot-repo :", slot)
        const bookedSlot = await slotSchema.findOneAndUpdate({ _id: slotId }, slot, { new: true })
        console.log("bookedslot-repo :", bookedSlot)
        return bookedSlot
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
