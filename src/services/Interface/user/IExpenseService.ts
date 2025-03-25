import { IExpense } from "../../../entities/expenseEntities"

export interface IExpenseService {
    getExpensesByUserId(userId:string):Promise<IExpense[]>
    createExpense(expense:IExpense):Promise<IExpense>
    hasExpenses(userId: string, startDate?: string, endDate?: string): Promise<boolean>;
    exportExpensesAsPDF(userId: string,startDate?: string, endDate?: string): Promise<NodeJS.ReadableStream>
    exportExpensesAsCSV(userId: string,startDate?: string, endDate?: string): Promise<string>
    exportExpensesAsExcel(userId:string,startDate?: string, endDate?: string):Promise<Buffer>
    // exportExpense(userId: string,format: 'pdf'|'excel',startDate?: string,endDate?: string): Promise<Buffer>;
}