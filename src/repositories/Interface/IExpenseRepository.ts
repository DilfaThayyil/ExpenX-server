import { IExpense } from "../../entities/expenseEntities";

export interface IExpenseRepository{
    findExpensesByUserId(userId: string): Promise<IExpense[]>;
    createExpense(expenseData: IExpense): Promise<IExpense>;
    findByUserId(userId:string,startDate?: string, endDate?: string):Promise<IExpense[]>
    getExpensesByUserAndDateRange(userId: string,startDate?: Date,endDate?: Date): Promise<IExpense[]>;
}