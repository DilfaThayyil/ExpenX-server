import { inject, injectable } from 'tsyringe';
import { IUserRepository } from '../../../repositories/Interface/IUserRepository';
import { IUserService } from '../../Interface/user/IUserService';
import { IExpense } from '../../../entities/expenseEntities';
import IGroup from '../../../entities/groupEntities';
import { IGroupExpense } from '../../../models/groupSchema';
import { Slot } from '../../../models/slotSchema';



@injectable()
export default class UserService implements IUserService {
  private userRepository: IUserRepository;

  constructor(@inject('IUserRepository') userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  async updateUserProfile(userData: { profilePic: string; username: string; email: string; phone: string; country: string; language: string }) {
    try {
      const updatedUser = await this.userRepository.updateUser(userData, userData.email);
      console.log("updated user ; ",updatedUser)
      return updatedUser;
    } catch (error) {
      throw new Error('Error updating user in service');
    }
  }

  async getExpensesByUserId(userId: string): Promise<IExpense[]> {
    console.log("userId from service : ",userId)
    return this.userRepository.findExpensesByUserId(userId);
  }

  async createExpense(expenseData: IExpense): Promise<IExpense> {
    return this.userRepository.createExpense(expenseData);
  }

  async createGroup(groupData: IGroup):Promise<IGroup>{
    console.log("service....")
    console.log("groupData in service: ",groupData)
    return this.userRepository.createGroup(groupData)
  }


  async getUserGroups(email:string):Promise<IGroup[]>{
    console.log("service calls....")
    const groups = await this.userRepository.getUserGroups(email)
    console.log("groups from service: ",groups)
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

    if (group.members.includes(memberEmail)) {
      throw new Error('Member already exists in the group');
    }

    return await this.userRepository.addMember(groupId, memberEmail);
  }


  async addExpenseInGroup(groupId: string, expenseData: IGroupExpense): Promise<IGroup> {
    if (!groupId || !expenseData.description || !expenseData.amount || !expenseData.paidBy) {
      throw new Error('Missing required expense information');
    }

    const group = await this.userRepository.findById(groupId);
    if (!group) {
      throw new Error('Group not found');
    }
    console.log("paidBy : ",expenseData.paidBy)
    if (!group.members.includes(expenseData.paidBy)) {
      throw new Error('Expense payer must be a group member');
    }

    const expense: IGroupExpense = {
      description: expenseData.description,
      amount: Number(expenseData.amount),
      paidBy: expenseData.paidBy,
      splitMethod: expenseData.splitMethod || group.splitMethod,
      date: new Date()
    };

    return await this.userRepository.addExpenseInGroup(groupId, expense);
  }


  async bookslot(slotId: string, userId: string): Promise<Slot | null> {
    try {
      console.log("slotId-service :", slotId);
      console.log("userId-service :", userId);
  
      const slot = await this.userRepository.findSlot(slotId);
      if (!slot) throw new Error("Slot not found");
      if (slot.status === "Booked") throw new Error("Slot is already booked");
  
      slot.status = "Booked";
      slot.bookedBy = userId;
      const bookedSlot = await this.userRepository.bookSlot(slotId, slot);
      console.log("bookedSlot-service :",bookedSlot)
      return bookedSlot
    } catch (err) {
      console.error(err);
      return null;
    }
  }
  

}
