import { IExpense } from "../../../entities/expenseEntities"
import { IGroup } from "../../../entities/groupEntities";

export interface IExpenseService {
    getExpensesByUserId(userId:string,page:number,limit:number):Promise<{expenses:IExpense[],totalPages:number}>
    createExpense(expense:IExpense):Promise<IExpense>
    hasExpenses(userId: string, startDate?: string, endDate?: string): Promise<boolean>;
    exportExpensesAsPDF(userId: string,startDate?: string, endDate?: string): Promise<NodeJS.ReadableStream>
    exportExpensesAsCSV(userId: string,startDate?: string, endDate?: string): Promise<string>
    exportExpensesAsExcel(userId:string,startDate?: string, endDate?: string):Promise<Buffer>
}