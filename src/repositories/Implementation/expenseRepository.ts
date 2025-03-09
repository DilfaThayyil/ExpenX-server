import { IExpense } from "../../entities/expenseEntities";
import expenseSchema from "../../models/expenseSchema";
import { IExpenseRepository } from "../Interface/IExpenseRepository";

export default class ExpenseRepository implements IExpenseRepository {
    async findByUserId(userId: string): Promise<IExpense[]> {
        return await expenseSchema.find({ userId }).sort({ date: -1 });
    }
}