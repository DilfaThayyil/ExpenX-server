import { Types } from "mongoose";
import { GroupMember, IGroup, IGroupExpense } from "../../entities/groupEntities";
import groupSchema from "../../models/groupSchema";
import { IGroupRepository } from "../Interface/IGroupRepository";
import { BaseRepository } from "./baseRepository";

export default class GroupRepository 
extends BaseRepository<IGroup>
implements IGroupRepository
{
    constructor(){
        super(groupSchema)
    }
    async findById(groupId: string): Promise<IGroup | null> {
        return await groupSchema.findById(groupId).populate("expenses")
    }
    async createGroup(groupData: IGroup): Promise<IGroup> {
        return groupSchema.create(groupData)
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
    async getUserGroups(email: string): Promise<IGroup[]> {
        const groups = await groupSchema.find({ members: { $elemMatch: { email } } });
        return groups
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
}