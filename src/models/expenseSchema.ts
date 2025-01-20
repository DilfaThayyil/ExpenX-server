import { model, Schema } from "mongoose";
import IExpense from "../entities/expenseEntities";

const ExpenseSchema: Schema = new Schema({
    userId: {type:Schema.Types.ObjectId, ref: 'User'},
    title: {type:String},
    amount: {type:Number},
    category: {type:String},
    date: {type:Date, default:Date.now},
    createdAt: {type:Date, default:Date.now},
    updatedAt: {type:Date, default:Date.now}
})

export default model<IExpense>("Expense",ExpenseSchema)