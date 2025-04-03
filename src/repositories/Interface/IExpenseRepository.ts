import { IExpense } from "../../entities/expenseEntities";

export interface IExpenseRepository{
    findExpensesByUserId(userId: string,page:number,limit:number): Promise<{expenses:IExpense[],totalExpenses:number}>;
    createExpense(expenseData: IExpense): Promise<IExpense>;
    findByUserId(userId:string,startDate?: string, endDate?: string):Promise<IExpense[]>
    getExpensesByUserAndDateRange(userId: string,startDate?: Date,endDate?: Date): Promise<IExpense[]>;
    createExpenses(expenses:IExpense[]):Promise<IExpense[]>
    getExpenseByCategory(clientId: string, startDate: Date | null, endDate: Date | null):Promise<IExpense[]>
}