import { IExpense } from "../../entities/expenseEntities";
import expenseSchema from "../../models/expenseSchema";
import { IExpenseRepository } from "../Interface/IExpenseRepository";
import { BaseRepository } from "./baseRepository";

export default class ExpenseRepository extends BaseRepository<IExpense> implements IExpenseRepository {

  constructor() {
    super(expenseSchema)
  }

  async findExpensesByUserId(
    userId: string,
    page: number,
    limit: number,
    search?: string 
  ): Promise<{ expenses: IExpense[], totalExpenses: number }> {
    const skip = (page - 1) * limit;
    const query: any = { userId };
    if (search) {
      query.description = { $regex: search, $options: 'i' };
    }
    const [expenses, totalExpenses] = await Promise.all([
      expenseSchema.find(query).skip(skip).limit(limit),
      expenseSchema.countDocuments(query)
    ]);
    console.log("expenses-repo : ",expenses)
    console.log("totalExpenses-repo : ",totalExpenses)
    return { expenses, totalExpenses };
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

  async createExpenses(expenses: IExpense[]): Promise<IExpense[]> {
    const createdExpenses = await expenseSchema.insertMany(expenses)
    console.log("createdexp-repo : ", createdExpenses)
    return createdExpenses
  }

  async getExpenseByCategory(clientId: string, startDate: Date | null, endDate: Date | null): Promise<IExpense[]> {
    const filter: any = { userId: clientId };
    if (startDate && endDate) {
      filter.date = { $gte: startDate, $lte: endDate };
    } else if (startDate) {
      filter.date = { $gte: startDate };
    }
    const expenses = await expenseSchema.aggregate([
      { $match: filter },{$group: {_id: "$category",totalAmount: { $sum: "$amount" }}},
      {$project: {category: "$_id",totalAmount: 1,_id: 0}}
    ]);
    console.log("expense-repo:", expenses);
    return expenses;
  }

}