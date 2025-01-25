import { IExpense } from "../../../entities/expenseEntities";
import IGroup from "../../../entities/groupEntities";

export interface IUserService {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updateUserProfile(userData: { profilePic: string; username: string; email: string; phone: string; country: string; language: string }): Promise<any>;
    getExpensesByUserId(userId: string): Promise<IExpense[]>;
    createExpense(expenseData: IExpense): Promise<IExpense>;
    createGroup(groupData:IGroup): Promise<IGroup>
}