import { IExpense } from "../../entities/expenseEntities";
import expenseSchema from "../../models/expenseSchema";
import { IExpenseRepository } from "../Interface/IExpenseRepository";
import { BaseRepository } from "./baseRepository";

export default class ExpenseRepository extends BaseRepository<IExpense> implements IExpenseRepository {
    
    constructor(){
        super(expenseSchema)
    }

    async findExpensesByUserId(userId: string): Promise<IExpense[]> {
        const expense = await expenseSchema.find({ userId });
        return expense
    }
    async createExpense(expenseData: IExpense): Promise<IExpense> {
        return expenseSchema.create(expenseData);
    }
    async findByUserId(userId: string): Promise<IExpense[]> {
        return await expenseSchema.find({ userId }).sort({ date: -1 });
    }
}