/* eslint-disable @typescript-eslint/no-explicit-any */
import { IExpense } from "../../entities/expenseEntities";
import IGroup from "../../entities/groupEntities";
import IUser from "../../entities/userEntities";
import { IGroupExpense } from "../../models/groupSchema";
import { Slot } from "../../models/slotSchema";

export interface IUserRepository {
  findUserByEmail(email: string): Promise<any>;
  createUser(userData: any): Promise<any>;
  updateUser(userData: any, email: string): Promise<any>;
  findUserByRefreshToken(refreshToken: string): Promise<any>;
  updateRefreshToken(refreshToken: string, email: string): Promise<any>;
  findUserByPhoneNumber(phoneNumber: string): Promise<any>;
  removeRefreshToken(email: string): Promise<any>;
  findExpensesByUserId(userId: string): Promise<IExpense[]>;
  createExpense(expenseData: IExpense): Promise<IExpense>;
  createGroup(groupData: IGroup):Promise<IGroup>
  getUserGroups(email:string):Promise<IGroup[]>
  fetchUsers(page: number, limit: number): Promise<{ users: IUser[]; totalUsers: number }>;
  findAdmin():Promise<any>
  updateAdmin(admin:any):Promise<any>
  updateUserStatus(email:string, isBlock:boolean):Promise<void>
  findById(groupId:string):Promise<IGroup | null>
  addMember(groupId:string,memberEmail:string):Promise<IGroup>
  addExpenseInGroup(groupId:string,expense:IGroupExpense):Promise<IGroup>
  findSlot(slotId:string):Promise<Slot | null>
  bookSlot(slotId:string,slot:Slot):Promise<Slot | null>
}
