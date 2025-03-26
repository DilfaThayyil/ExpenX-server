import { inject, injectable } from "tsyringe";
import { IGroupRepository } from "../../../repositories/Interface/IGroupRepository";
import { IGroupService } from "../../Interface/group/IGroupService";
import { Types } from "mongoose";
import { GroupMember, IGroup, ISplit } from "../../../entities/groupEntities";
import { IUserRepository } from "../../../repositories/Interface/IUserRepository";
import { IExpenseRepository } from "../../../repositories/Interface/IExpenseRepository";

@injectable()
export default class GroupService implements IGroupService {
  private groupRepository: IGroupRepository
  private userRepository: IUserRepository
  private expenseRepository: IExpenseRepository

  constructor(
    @inject('IGroupRepository') groupRepository: IGroupRepository,
    @inject('IUserRepository') userRepository: IUserRepository,
    @inject('IExpenseRepository') expenseRepository: IExpenseRepository
  ) {
    this.groupRepository = groupRepository
    this.userRepository = userRepository
    this.expenseRepository = expenseRepository
  }

  async createGroup(userId: string, name: string, members: string[]): Promise<IGroup> {
    try {
      const modifiedMembers = members.map((memberEmail: string) => ({
        id: memberEmail.replace('@', '_'),
        name: memberEmail.split('@')[0],
        email: memberEmail,
        avatar: `https://ui-avatars.com/api/?name=${memberEmail.split('@')[0]}`,
        paid: 0,
        owed: 0,
      }))
      const newGroup: IGroup = {
        name,
        createdBy: userId,
        members: modifiedMembers,
        expenses: [],
      }
      return await this.groupRepository.createGroup(newGroup)
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  async getUserGroups(userId: string): Promise<IGroup[]> {
    const user = await this.userRepository.findUserById(userId)
    if (!user) {
      throw new Error('User not found')
    }
    const groups = await this.groupRepository.getUserGroups(user?.email)
    return groups
  }

  async addMember(groupId: string, memberEmail: string): Promise<IGroup> {
    if (!groupId || !memberEmail) {
      throw new Error('Group ID and member email are required');
    }
    const group = await this.groupRepository.findById(groupId);
    if (!group) {
      throw new Error('Group not found');
    }
    if (group.members.some((member) => member.email === memberEmail)) {
      throw new Error('Member already exists in the group')
    }
    const newMember: GroupMember = {
      id: memberEmail.replace('@', '_'),
      name: memberEmail.split('@')[0],
      email: memberEmail,
      avatar: `https://ui-avatars.com/api/?name=${memberEmail.split('@')[0]}`,
      paid: 0,
      owed: 0
    };
    return await this.groupRepository.addMember(groupId, newMember);
  }


  async addExpenseInGroup(groupId: string, expenseData: any): Promise<IGroup> {
    try {
      if (!groupId || !expenseData.title || !expenseData.totalAmount || !expenseData.paidBy || !expenseData.splitMethod) {
        throw new Error('Missing required expense information');
      }
      const group = await this.groupRepository.findById(groupId);
      if (!group) {
        throw new Error('Group not found');
      }
      const { splitMethod, shares, totalAmount } = expenseData;
      let splits: ISplit[] = [];
      if (splitMethod === "percentage") {
        const totalPercentage = Object.values(shares).reduce((sum: number, percent) => sum + Number(percent), 0);
        if (totalPercentage !== 100) {
          throw new Error('Total percentage must equal 100%');
        }
        splits = Object.entries(shares).map(([email, percentage]) => ({
          user: email,
          amountOwed: (Number(percentage) / 100) * totalAmount,
          percentage: Number(percentage),
          customAmount: undefined,
          status: 'pending',
        }));
      }
      else if (splitMethod === "custom") {
        const totalCustomAmount = Object.values(shares).reduce((sum: number, amount) => sum + Number(amount), 0);
        if (totalCustomAmount !== totalAmount) {
          throw new Error('Total custom amounts must equal total expense amount');
        }
        splits = Object.entries(shares).map(([email, customAmount]) => ({
          user: email,
          amountOwed: Number(customAmount),
          percentage: undefined,
          customAmount: Number(customAmount),
          status: 'pending',
        }));
      }
      else {
        const memberCount = Object.keys(shares).length;
        const equalAmount = totalAmount / memberCount;

        splits = Object.entries(shares).map(([email]) => ({
          user: email,
          amountOwed: equalAmount,
          percentage: undefined,
          customAmount: undefined,
          status: 'pending',
        }));
      }
      const userEmails = Object.keys(shares);
      const users = await this.userRepository.findUsersByEmails(userEmails);
      const userMap = new Map(users.map(user => [user.email, user._id]));
      const individualExpenses = splits.map(split => {
        const userId = userMap.get((split.user).toString());
        if (!userId) {
          throw new Error(`User with email ${split.user} not found`);
        }
        return {
          date: new Date(expenseData.date),
          amount: split.amountOwed,
          category: "Group Expense",
          description: expenseData.title,
          userId: userId, 
        };
      });
      const expense = {
        groupId: new Types.ObjectId(groupId),
        date: expenseData.date,
        title: expenseData.title,
        totalAmount,
        paidBy: expenseData.paidBy,
        splitMethod,
        splits
      };
      const updatedGroup = await this.groupRepository.addExpenseInGroup(groupId, expense);
      await this.expenseRepository.createExpenses(individualExpenses);
      return updatedGroup
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}