import { model, Schema } from "mongoose";
import { IExpense } from "../entities/expenseEntities";

const ExpenseSchema: Schema = new Schema(
    {
        date: { type: Date },
        amount: { type: Number },
        category: { type: String },
        description: { type: String},
        userId: { type: String },
      },
      { timestamps: true }
)  
  export default model<IExpense>('Expense', ExpenseSchema)