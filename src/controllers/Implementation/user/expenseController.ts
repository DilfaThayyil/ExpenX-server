import { inject, injectable } from "tsyringe";
import { IExpenseController } from "../../Interface/user/IExpenseController";
import { IExpenseService } from "../../../services/Interface/user/IExpenseService";
import { Request, Response } from "express";

@injectable()
export default class ExpenseController implements IExpenseController {
    private expenseService: IExpenseService

    constructor(@inject('IExpenseService') expenseService: IExpenseService) {
        this.expenseService = expenseService
    }

    async exportExpense(req: Request, res: Response): Promise<Response | void> {
        try {
            const userId = req.params.userId;
            const format = req.query.format as string;
            console.log(`Export request received for user ${userId} in ${format} format`);

            switch (format) {
                case 'pdf':
                    console.log("Beginning PDF export");
                    const pdfStream = await this.expenseService.exportExpensesAsPDF(userId);

                    res.setHeader('Content-Type', 'application/pdf');
                    res.setHeader('Content-Disposition', 'attachment; filename=expense-report.pdf');

                    pdfStream.pipe(res);

                    pdfStream.on('end', () => {
                        console.log("PDF export completed successfully");
                    });

                    pdfStream.on('error', (err) => {
                        console.error("PDF Stream Error:", err);
                        res.status(500).json({ message: 'Failed to generate PDF' });
                    });

                    return;


                case 'csv':
                    const csv = await this.expenseService.exportExpensesAsCSV(userId);
                    res.setHeader('Content-Type', 'text/csv');
                    res.setHeader('Content-Disposition', 'attachment; filename=expense-report.csv');
                    return res.send(csv);

                // case 'excel':
                //     console.log("Beginning Excel export");
                //     const excelBuffer = await this.expenseService.exportExpensesAsExcel(userId);

                //     res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                //     res.setHeader('Content-Disposition', 'attachment; filename=expense-report.xlsx');
                //     res.setHeader('Content-Length', excelBuffer.length); // Ensures correct size
                //     console.log('Excel Buffer Type:', typeof excelBuffer);
                //     console.log('Excel Buffer Length:', excelBuffer.length);
                //     return res.end(excelBuffer);


                default:
                    return res.status(400).json({ message: 'Invalid export format' });
            }
        } catch (error) {
            console.error('Export error:', error);
            return res.status(500).json({ message: 'Failed to export expenses' });
        }
    }
}
