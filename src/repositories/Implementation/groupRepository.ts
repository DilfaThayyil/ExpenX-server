import { Types } from "mongoose";
import { GroupMember, IGroup, IGroupExpense, ISettlement } from "../../entities/groupEntities";
import groupSchema from "../../models/groupSchema";
import { IGroupRepository } from "../Interface/IGroupRepository";
import { BaseRepository } from "./baseRepository";

export default class GroupRepository extends BaseRepository<IGroup> implements IGroupRepository {
    constructor() {
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
    async removeMember(groupId: string, email: string): Promise<IGroup | null> {
        const updatedGroup = await groupSchema.findByIdAndUpdate(
            groupId,
            {
                $pull: {
                    pendingInvites: { email: email },
                    members: { email: email }
                }
            },
            { new: true }
        );
        return updatedGroup;
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

    async addSettlement(groupId: string, settlement: ISettlement): Promise<IGroup | null> {
        return await groupSchema.findByIdAndUpdate(
            groupId,
            { $push: { settlements: settlement } },
            { new: true }
        );
    }
}