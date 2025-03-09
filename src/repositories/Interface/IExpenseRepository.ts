import { IExpense } from "../../entities/expenseEntities";

export interface IExpenseRepository{
    findByUserId(userId:string):Promise<IExpense[]>
}