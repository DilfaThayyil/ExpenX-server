import { inject, injectable } from 'tsyringe';
import { IUserRepository } from '../../../repositories/Interface/IUserRepository';
import { IUserService } from '../../Interface/user/IUserService';
import { IExpense } from '../../../entities/expenseEntities';
import { Slot } from '../../../models/slotSchema';
import { GroupMember, IGroup, ISplit } from '../../../entities/groupEntities';
import { Types } from 'mongoose';
import { IReport } from '../../../models/reportSchema';
import IAdvisor from '../../../entities/advisorEntities';
import { IReview } from '../../../models/reviewSchema';
import { IGoal } from '../../../models/goalsSchema';
import { ICategory } from '../../../models/categorySchema';
import { DashboardData } from '../../../repositories/Implementation/userRepository';

@injectable()
export default class UserService implements IUserService {
  private userRepository: IUserRepository;

  constructor(@inject('IUserRepository') userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  async updateUserProfile(userData: { profilePic: string; username: string; email: string; phone: string; country: string; language: string }) {
    try {
      const updatedUser = await this.userRepository.updateUser(userData, userData.email);
      console.log("updated user ; ", updatedUser)
      return updatedUser;
    } catch (error) {
      throw new Error('Error updating user in service');
    }
  }

  

  async getCategories(): Promise<ICategory[]> {
    return this.userRepository.getCategories()
  }

  async createGroup(userId: string, name: string, members: string[]): Promise<IGroup> {
    try {
      console.log("userId,name,members-serv : ", userId, ',', name, ',', members)
      const modifiedMembers = members.map((memberEmail: string) => ({
        id: memberEmail.replace('@', '_'),
        name: memberEmail.split('@')[0],
        email: memberEmail,
        avatar: `https://ui-avatars.com/api/?name=${memberEmail.split('@')[0]}`,
        paid: 0,
        owed: 0,
      }))
      console.log("modifiedMembers-serv : ", modifiedMembers)
      const newGroup: IGroup = {
        name,
        createdBy: userId,
        members: modifiedMembers,
        expenses: [],
      }
      return await this.userRepository.createGroup(newGroup)
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  async getUserGroups(userId: string): Promise<IGroup[]> {
    const user = await this.userRepository.findUserById(userId)
    if (!user) {
      console.log("!!! user not found !!!!!")
      throw new Error('User not found')
    }
    const groups = await this.userRepository.getUserGroups(user?.email)
    // console.log("groups-serv : ", groups)
    return groups
  }

  async addMember(groupId: string, memberEmail: string): Promise<IGroup> {
    if (!groupId || !memberEmail) {
      throw new Error('Group ID and member email are required');
    }
    const group = await this.userRepository.findById(groupId);
    if (!group) {
      throw new Error('Group not found');
    }
    console.log("group-serv : ", group)
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
    return await this.userRepository.addMember(groupId, newMember);
  }


  async addExpenseInGroup(groupId: string, expenseData: any): Promise<IGroup> {
    try {
      console.log("expenseData-serv : ", expenseData);
      if (!groupId || !expenseData.title || !expenseData.totalAmount || !expenseData.paidBy || !expenseData.splitMethod) {
        throw new Error('Missing required expense information');
      }
      const group = await this.userRepository.findById(groupId);
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
      const expense = {
        groupId: new Types.ObjectId(groupId),
        date: expenseData.date,
        title: expenseData.title,
        totalAmount,
        paidBy: expenseData.paidBy,
        splitMethod,
        splits
      };
      return await this.userRepository.addExpenseInGroup(groupId, expense);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async bookslot(slotId: string, userId: string): Promise<Slot | null> {
    try {
      const slot = await this.userRepository.findSlot(slotId);
      if (!slot) throw new Error("Slot not found");
      if (slot.status === "Booked") throw new Error("Slot is already booked");

      const user = await this.userRepository.findUserById(userId);
      if (!user) throw new Error("User not found");

      slot.status = "Booked";
      slot.bookedBy = {
        _id: user._id,
        username: user.username,
        email: user.email,
        profilePic: user.profilePic
      };

      const bookedSlot = await this.userRepository.bookSlot(slotId, slot);
      return bookedSlot;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async reportAdvisor(slotId:string,userId: string, advisorId: string, reason: "Spam" | "Inappropriate Content" | "Harassment" | "Other", customReason?: string): Promise<IReport> {
    const data: IReport = { userId: new Types.ObjectId(userId), advisorId: new Types.ObjectId(advisorId), reason, customReason, status: "pending", createdAt: new Date() };
    const report = await this.userRepository.createReport(data);
    const updateSlot = await this.userRepository.updateSlot(slotId)
    return report;
  }
  async fetchSlotsByUser(userId: string, page: number, limit: number): Promise<{ slots: Slot[], totalPages: number }> {
    const result = await this.userRepository.fetchSlotsByUser(userId, page, limit);
    return result
  }
  async getAdvisors():Promise<IAdvisor[]>{
    const advisors = await this.userRepository.getAdvisors()
    return advisors
  }
  async createReview(advisorId: string, userId: string, rating: number, review: string): Promise<IReview> {
    const newReview = await this.userRepository.createReview(advisorId, userId, rating, review);
    console.log("newReview-serv : ",newReview)
    return newReview
  }
  async createGoal(userId: string, goalData: Partial<IGoal>): Promise<IGoal> {
    const goal = await this.userRepository.createGoal({ ...goalData, userId });
    console.log("goal-service : ",goal)
    return goal
  }
  async getGoalsById(userId: string): Promise<IGoal[]> {
    const goals = await this.userRepository.getGoalsById(userId);
    console.log("getGoals-service : ",goals)
    return goals
  }
  async getGoalById(id:string):Promise<IGoal | null>{
    const goal = await this.userRepository.getGoalById(id)
    return goal
  }
  async updateGoal(id:string,goalData:Partial<IGoal>):Promise<IGoal | null>{
    const updatedGoal = await this.userRepository.updateGoal(id,goalData)
    console.log("updatedGoal-servie : ",updatedGoal)
    return updatedGoal
  }
  async deleteGoal(id: string): Promise<boolean | null> {
    return await this.userRepository.deleteGoal(id);
  }

  async updateGoalProgress(id: string, amount: number): Promise<IGoal | null> {
    const goal = await this.userRepository.getGoalById(id);
    console.log("goal-service : ",goal)
    if (!goal) return null;
    const newAmount = goal.current + amount;
    const current = Math.max(0, Math.min(goal.target, newAmount));
    return this.userRepository.updateGoal(id, { current });
  }

  async getDashboardData(userId:string):Promise<DashboardData>{
    const data = await this.userRepository.getDashboardData(userId)
    return data
  }

}
