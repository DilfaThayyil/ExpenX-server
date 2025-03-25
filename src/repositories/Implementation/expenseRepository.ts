import { IExpense } from "../../entities/expenseEntities";
import expenseSchema from "../../models/expenseSchema";
import { IExpenseRepository } from "../Interface/IExpenseRepository";
import { BaseRepository } from "./baseRepository";

export default class ExpenseRepository extends BaseRepository<IExpense> implements IExpenseRepository {

  constructor() {
    super(expenseSchema)
  }

  async findExpensesByUserId(userId: string): Promise<IExpense[]> {
    const expense = await expenseSchema.find({ userId });
    return expense
  }
  async createExpense(expenseData: IExpense): Promise<IExpense> {
    return expenseSchema.create(expenseData);
  }
  // async findByUserId(userId: string): Promise<IExpense[]> {
  //     return await expenseSchema.find({ userId }).sort({ date: -1 });
  // }

  async findByUserId(userId: string, startDate?: string, endDate?: string): Promise<IExpense[]> {
    const filter: any = { userId };
    if (startDate) {
      filter.date = { $gte: new Date(startDate) };
    }
    if (endDate) {
      filter.date = filter.date ? { ...filter.date, $lte: new Date(endDate) } : { $lte: new Date(endDate) };
    }
    return await expenseSchema.find(filter).sort({ date: -1 });
  }

  async getExpensesByUserAndDateRange(
    userId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<IExpense[]> {
    const query: any = { userId };

    if (startDate && endDate) {
      query.date = { $gte: startDate, $lte: endDate };
    }

    const expenses = await expenseSchema.find(query).lean<IExpense[]>();
    return expenses;
  }
}