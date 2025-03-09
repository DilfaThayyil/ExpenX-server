import { inject, injectable } from "tsyringe";
import { IExpenseService } from "../../Interface/user/IExpenseService";
import { IExpenseRepository } from "../../../repositories/Interface/IExpenseRepository";
import { IExpense } from "../../../entities/expenseEntities";
import PDFDocument from 'pdfkit';
import { Parser as JsonToCsvParser } from 'json2csv';
import ExcelJS from 'exceljs';
import { Buffer } from 'node:buffer';


@injectable()
export default class ExpenseService implements IExpenseService {
    private expenseRepository: IExpenseRepository
    constructor(@inject('IExpenseRepository') expenseRepository: IExpenseRepository) {
        this.expenseRepository = expenseRepository
    }
    async exportExpensesAsPDF(userId: string): Promise<NodeJS.ReadableStream> {
        try {
            const expenses = await this.expenseRepository.findByUserId(userId);
            const doc = new PDFDocument();
    
            doc.fontSize(25).text('Expense Report', { align: 'center' });
            doc.moveDown();
            doc.fontSize(12).text(`Generated on: ${new Date().toLocaleDateString()}`, { align: 'right' });
            doc.moveDown();
            
            const total = expenses.reduce((sum: number, expense: IExpense) => sum + expense.amount, 0);
            doc.fontSize(14).text(`Total Expenses: $${total.toFixed(2)}`, { align: 'left' });
            doc.moveDown();
            
            // Table Headers
            const startX = 50;
            let startY = doc.y + 10;
            const rowHeight = 20;
            const colWidths = [120, 150, 100, 100];
    
            doc.font('Helvetica-Bold');
            doc.text('Date', startX, startY);
            doc.text('Description', startX + colWidths[0], startY);
            doc.text('Category', startX + colWidths[0] + colWidths[1], startY);
            doc.text('Amount ($)', startX + colWidths[0] + colWidths[1] + colWidths[2], startY);
            doc.font('Helvetica');
    
            startY += rowHeight;
    
            expenses.forEach((expense: IExpense) => {
                if (startY > doc.page.height - 50) {
                    doc.addPage();
                    startY = 50;
                }
                const date = new Date(expense.date).toLocaleDateString();
                doc.text(date, startX, startY);
                doc.text(expense.description || '', startX + colWidths[0], startY);
                doc.text(expense.category || '', startX + colWidths[0] + colWidths[1], startY);
                doc.text(expense.amount.toFixed(2), startX + colWidths[0] + colWidths[1] + colWidths[2], startY);
                startY += rowHeight;
            });
    
            doc.end();  // ✅ Finalize the PDF stream
            return doc;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
    


    async exportExpensesAsCSV(userId: string): Promise<string> {
        try {
            const expenses = await this.expenseRepository.findByUserId(userId);
            console.log("expenses-CSV-serv : ", expenses)
            const formattedExpenses = expenses.map((expense: IExpense) => ({
                Date: new Date(expense.date).toLocaleDateString(),
                Description: expense.description || '',
                Category: expense.category || '',
                Amount: expense.amount.toFixed(2)
            }));
            const fields = ['Date', 'Description', 'Category', 'Amount'];
            const parser = new JsonToCsvParser({ fields });
            const csv = parser.parse(formattedExpenses);
            return csv;
        } catch (err) {
            console.error(err)
            throw err
        }
    }


    // async exportExpensesAsExcel(userId: string): Promise<Buffer> {
    //     try {
    //         const expenses = await this.expenseRepository.findByUserId(userId);
    //         console.log("expenses-Excel-repo : ", expenses)
    //         const workbook = new ExcelJS.Workbook();
    //         const worksheet = workbook.addWorksheet('Expenses');
    //         worksheet.columns = [
    //             { header: 'Date', key: 'date', width: 15 },
    //             { header: 'Description', key: 'description', width: 30 },
    //             { header: 'Category', key: 'category', width: 15 },
    //             { header: 'Amount ($)', key: 'amount', width: 15 }
    //         ];
    //         worksheet.getRow(1).font = { bold: true };
    //         expenses.forEach((expense: IExpense) => {
    //             worksheet.addRow({
    //                 date: new Date(expense.date).toLocaleDateString(),
    //                 description: expense.description || '',
    //                 category: expense.category || '',
    //                 amount: expense.amount.toFixed(2)
    //             });
    //         });
    //         const totalRow = worksheet.rowCount + 2;
    //         worksheet.getCell(`A${totalRow}`).value = 'Total';
    //         worksheet.getCell(`A${totalRow}`).font = { bold: true };

    //         const total = expenses.reduce((sum: number, expense: IExpense) => sum + expense.amount, 0);
    //         worksheet.getCell(`D${totalRow}`).value = total.toFixed(2);
    //         worksheet.getCell(`D${totalRow}`).font = { bold: true };

    //         const arrayBuffer = await workbook.xlsx.writeBuffer();
    //         return Buffer.from(arrayBuffer);
    //     } catch (err) {
    //         console.error(err)
    //         throw err
    //     }
    // }
}