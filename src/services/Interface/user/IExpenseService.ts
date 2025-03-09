export interface IExpenseService{
    exportExpensesAsPDF(userId:string):Promise<NodeJS.ReadableStream>
    exportExpensesAsCSV(userId:string):Promise<string>
    // exportExpensesAsExcel(userId:string):Promise<Buffer>
}