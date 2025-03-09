import { IExpense } from "../../entities/expenseEntities";

export interface IExpenseRepository{
    findExpensesByUserId(userId: string): Promise<IExpense[]>;
    createExpense(expenseData: IExpense): Promise<IExpense>;
    findByUserId(userId:string):Promise<IExpense[]>
}