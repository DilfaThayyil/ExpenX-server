import { IExpense } from "../../../entities/expenseEntities"

export interface IExpenseService {
    getExpensesByUserId(userId:string):Promise<IExpense[]>
    createExpense(expense:IExpense):Promise<IExpense>
    exportExpensesAsPDF(userId: string): Promise<NodeJS.ReadableStream>
    exportExpensesAsCSV(userId: string): Promise<string>
    // exportExpensesAsExcel(userId:string):Promise<Buffer>
}