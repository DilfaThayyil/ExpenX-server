import { IExpense } from "../../../entities/expenseEntities";
import { IGroup, IGroupExpense } from "../../../entities/groupEntities";
import { Slot } from "../../../models/slotSchema";

export interface IUserService {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updateUserProfile(userData: { profilePic: string; username: string; email: string; phone: string; country: string; language: string }): Promise<any>;
    getExpensesByUserId(userId: string): Promise<IExpense[]>;
    createExpense(expenseData: IExpense): Promise<IExpense>;
    createGroup(userId:string,name:string,members:[string]): Promise<IGroup>
    getUserGroups(userId:string): Promise<IGroup[]>;
    addMember(groupId:string,memberEmail:string):Promise<IGroup>
    addExpenseInGroup(groupId:string,expenseData:any):Promise<IGroup>
    bookslot(slotId:string,userId:string):Promise<Slot | null>
}