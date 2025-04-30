import { inject, injectable } from "tsyringe";
import { IGroupRepository } from "../../../repositories/Interface/IGroupRepository";
import { IGroupService } from "../../Interface/group/IGroupService";
import { Types } from "mongoose";
import { GroupMember, IGroup, ISettlement, ISplit } from "../../../entities/groupEntities";
import { IUserRepository } from "../../../repositories/Interface/IUserRepository";
import { IExpenseRepository } from "../../../repositories/Interface/IExpenseRepository";
import { sendGroupInviteEmail } from "../../../utils/email/sendGroupInviteEmail";
import { CLIENTURL } from "../../../config/env";

@injectable()
export default class GroupService implements IGroupService {
  private _groupRepository: IGroupRepository
  private _userRepository: IUserRepository
  private _expenseRepository: IExpenseRepository

  constructor(
    @inject('IGroupRepository') groupRepository: IGroupRepository,
    @inject('IUserRepository') userRepository: IUserRepository,
    @inject('IExpenseRepository') expenseRepository: IExpenseRepository
  ) {
    this._groupRepository = groupRepository
    this._userRepository = userRepository
    this._expenseRepository = expenseRepository
  }

  async createGroup(userId: string, name: string, members: string[], creatorEmail: string): Promise<IGroup> {
    try {
      const creatorMember = {
        id: creatorEmail.replace('@', '_'),
        name: creatorEmail.split('@')[0],
        email: creatorEmail,
        avatar: `https://ui-avatars.com/api/?name=${creatorEmail.split('@')[0]}`,
        paid: 0,
        owed: 0,
      };
      const invitedMembers = members.filter(memberEmail => memberEmail !== creatorEmail);
      const modifiedPendingInvites = invitedMembers.map((memberEmail: string) => ({
        id: memberEmail.replace('@', '_'),
        name: memberEmail.split('@')[0],
        email: memberEmail,
        avatar: `https://ui-avatars.com/api/?name=${memberEmail.split('@')[0]}`,
        paid: 0,
        owed: 0,
      }));
      const newGroup: IGroup = {
        name,
        createdBy: userId,
        pendingInvites: modifiedPendingInvites,
        members: [creatorMember],
        expenses: [],
        settlements: []
      }
      const createdGroup = await this._groupRepository.createGroup(newGroup);
      for (const memberEmail of invitedMembers) {
        console.log("invitingMemberEmail : ",memberEmail)
        const existingUser = await this._userRepository.findByEmail(memberEmail);
        console.log("existingUser-service : ",existingUser)
        const acceptLink = `/accept-invite?groupId=${createdGroup._id}&email=${encodeURIComponent(memberEmail)}`;
        console.log("acceptLink - srvice : ",acceptLink)
        await sendGroupInviteEmail(memberEmail, name, acceptLink, !!existingUser);
      }
      return createdGroup
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  async getUserGroups(userId: string): Promise<IGroup[]> {
    const user = await this._userRepository.findUserById(userId)
    if (!user) {
      throw new Error('User not found')
    }
    const groups = await this._groupRepository.getUserGroups(user?.email)
    return groups
  }

  async addMember(groupId: string, memberEmail: string): Promise<IGroup> {
    if (!groupId || !memberEmail) {
      throw new Error('Group ID and member email are required');
    }
    const group = await this._groupRepository.findById(groupId);
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
    return await this._groupRepository.addMember(groupId, newMember);
  }


  async addExpenseInGroup(groupId: string, expenseData: any): Promise<IGroup> {
    try {
      if (!groupId || !expenseData.title || !expenseData.totalAmount || !expenseData.paidBy || !expenseData.splitMethod) {
        throw new Error('Missing required expense information');
      }
      const group = await this._groupRepository.findById(groupId);
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
      const users = await this._userRepository.findUsersByEmails(userEmails);
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
      const updatedGroup = await this._groupRepository.addExpenseInGroup(groupId, expense);
      await this._expenseRepository.createExpenses(individualExpenses);
      return updatedGroup
    } catch (err) {
      console.error(err);
      throw err;
    }
  }


  // async removeMember(groupId: string, memberEmail: string): Promise<{ success: boolean; message: string; group?: IGroup }> {
  //   try {
  //     const group = await this._groupRepository.findById(groupId);
  //     if (!group) {
  //       return { success: false, message: 'Group not found' };
  //     }
  //     if (!group.members.some(member => member.email === memberEmail)) {
  //       return { success: false, message: 'Member not found in the group' };
  //     }
  //     const hasPendingTransactions = this.checkPendingTransactions(group, memberEmail);
  //     if (hasPendingTransactions) {
  //       return { success: false, message: 'Member has unsettled expenses. Please settle all expenses before removing.' };
  //     }
  //     const updatedGroup = await this._groupRepository.removeMember(groupId, memberEmail);
  //     return {
  //       success: true,
  //       message: 'Member removed successfully',
  //       group: updatedGroup as IGroup
  //     };
  //   } catch (error) {
  //     console.error('Error removing member:', error);
  //     return { success: false, message: 'Failed to remove member' };
  //   }
  // }


  // private checkPendingTransactions(group: IGroup, memberEmail: string): boolean {
  //   let memberBalance = 0;
  //   group.expenses.forEach(expense => {
  //     if (expense.paidBy === memberEmail) {
  //       memberBalance += expense.totalAmount;
  //     }
  //   });
  //   group.expenses.forEach(expense => {
  //     const split = expense?.splits?.find(s => s.user === memberEmail);
  //     if (split) {
  //       memberBalance -= split.amountOwed;
  //     }
  //   });
  //   group.settlements.forEach(settlement => {
  //     if (settlement.from === memberEmail) {
  //       memberBalance -= settlement.amount;
  //     }
  //     if (settlement.to === memberEmail) {
  //       memberBalance += settlement.amount;
  //     }
  //   });
  //   return Math.abs(memberBalance) > 0.01;
  // }


  // async leaveGroup(groupId: string, userEmail: string): Promise<{ success: boolean; message: string }> {
  //   try {
  //     const group = await this._groupRepository.findById(groupId);
  //     if (!group) {
  //       return { success: false, message: 'Group not found' };
  //     }
  //     if (group.createdBy === userEmail) {
  //       return { success: false, message: 'Group owner cannot leave the group. Transfer ownership or delete the group.' };
  //     }
  //     const hasPendingTransactions = this.checkPendingTransactions(group, userEmail);
  //     if (hasPendingTransactions) {
  //       return { success: false, message: 'You have unsettled expenses. Please settle all expenses before leaving.' };
  //     }
  //     await this._groupRepository.removeMember(groupId, userEmail);
  //     return { success: true, message: 'You have left the group successfully' };
  //   } catch (error) {
  //     console.error('Error leaving group:', error);
  //     return { success: false, message: 'Failed to leave group' };
  //   }
  // }


  // async settleDebt(groupId: string, settlement: ISettlement): Promise<{ success: boolean; message: string; group?: IGroup }> {
  //   try {
  //     const group = await this._groupRepository.findById(groupId);
  //     if (!group) {
  //       return { success: false, message: 'Group not found' };
  //     }
  //     const fromMemberExists = group.members.some(m => m.email === settlement.from);
  //     const toMemberExists = group.members.some(m => m.email === settlement.to);
  //     if (!fromMemberExists || !toMemberExists) {
  //       return { success: false, message: 'One or both members not found in the group' };
  //     }
  //     const updatedGroup = await this._groupRepository.addSettlement(groupId, settlement);
  //     return {
  //       success: true,
  //       message: 'Settlement recorded successfully',
  //       group: updatedGroup as IGroup
  //     };
  //   } catch (error) {
  //     console.error('Error settling debt:', error);
  //     return { success: false, message: 'Failed to record settlement' };
  //   }
  // }


  async groupInvite(groupId: string, email: string): Promise<void> {
    console.log("📨 groupInvite called with:", { groupId, email });
  
    const group = await this._groupRepository.findById(groupId);
    console.log("📦 Retrieved group:", group);
  
    if (!group) {
      console.error("❌ Group not found for ID:", groupId);
      throw new Error("Group not found");
    }
  
    const alreadyMember = group.members.some(member => member.email === email);
    console.log("👥 Is user already a member?", alreadyMember);
  
    if (alreadyMember) {
      console.log("ℹ️ User is already a member. Skipping invite.");
      return;
    }
  
    const newMember = {
      id: email.replace('@', '_'),
      name: email.split('@')[0],
      email: email,
      avatar: `https://ui-avatars.com/api/?name=${email.split('@')[0]}`,
      paid: 0,
      owed: 0
    };
  
    console.log("➕ New member to add:", newMember);
  
    console.log("🧹 Removing previous invite or member (if any)...");
    await this._groupRepository.removeMember(groupId, email);
  
    console.log("✅ Adding new member to group...");
    await this._groupRepository.addMember(groupId, newMember);
  
    console.log("🎉 Member successfully invited and added to group:", groupId);
  }
  

}


