import { inject, injectable } from "tsyringe";
import { IExpenseController } from "../../Interface/user/IExpenseController";
import { IExpenseService } from "../../../services/Interface/user/IExpenseService";
import { Request, Response } from "express";
import { HttpStatusCode } from "../../../utils/httpStatusCode";

@injectable()
export default class ExpenseController implements IExpenseController {
  private expenseService: IExpenseService

  constructor(@inject('IExpenseService') expenseService: IExpenseService) {
    this.expenseService = expenseService
  }

  async getExpenses(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const page = Math.max(1, parseInt(req.query.currentPage as string) || 1);
      const limit = Math.max(1, parseInt(req.query.limit as string) || 4);
      const {expenses,totalPages} = await this.expenseService.getExpensesByUserId(userId,page,limit);
      res.status(HttpStatusCode.OK).json({success:true,data:{expenses,totalPages}});
    } catch (error) {
      console.error('Error fetching expenses:', error);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: 'Error fetching expenses' });
    }
  }

  async createExpense(req: Request, res: Response): Promise<void> {
    try {
      // console.log('dillll')
      const { userId } = req.params
      const { date, amount, category, description } = req.body;
      if (!date || !amount || !category || !description) {
        res.status(HttpStatusCode.BAD_REQUEST).json({ error: 'All fields are required' });
        return;
      }
      const newExpense = await this.expenseService.createExpense({
        userId: userId,
        date,
        amount,
        category,
        description,
      });
      // console.log("new expense: ",newExpense)
      res.status(HttpStatusCode.CREATED).json(newExpense);
    } catch (error) {
      console.error('Error creating expense:', error);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: 'Error creating expense' });
    }
  }


  async exportExpense(req: Request, res: Response): Promise<Response | void> {
    try {
      const { userId, format, startDate, endDate } = req.query;
      console.log(`Export request received for user ${userId} in ${format} format with date range: ${startDate} - ${endDate}`);

      const hasExpenses = await this.expenseService.hasExpenses(userId as string, startDate as string, endDate as string);
      if (!hasExpenses) {
        return res.status(HttpStatusCode.NOT_FOUND).json({ message: "No expenses found in the selected date range." });
      }

      switch (format) {
        case 'pdf':
          console.log("Beginning PDF export");
          const pdfStream = await this.expenseService.exportExpensesAsPDF(userId as string, startDate as string, endDate as string);
          res.setHeader('Content-Type', 'application/pdf');
          res.setHeader('Content-Disposition', 'attachment; filename=expense-report.pdf');
          pdfStream.pipe(res);
          pdfStream.on('end', () => console.log("PDF export completed successfully"));
          pdfStream.on('error', (err) => {
            console.error("PDF Stream Error:", err);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Failed to generate PDF' });
          });
          return;
        case 'csv':
          console.log("Beginning CSV export");
          const csv = await this.expenseService.exportExpensesAsCSV(userId as string, startDate as string, endDate as string);
          res.setHeader('Content-Type', 'text/csv');
          res.setHeader('Content-Disposition', 'attachment; filename=expense-report.csv');
          return res.send(csv);

        case 'excel':
          console.log("Beginning Excel export");
          const excelBuffer = await this.expenseService.exportExpensesAsExcel(userId as string, startDate as string, endDate as string);
          res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
          res.setHeader('Content-Disposition', 'attachment; filename=expense-report.xlsx');
          res.setHeader('Content-Length', excelBuffer.length);
          return res.end(excelBuffer);

        default:
          return res.status(HttpStatusCode.BAD_REQUEST).json({ message: 'Invalid export format' });
      }
    } catch (error) {
      console.error('Export error:', error);
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Failed to export expenses' });
    }
  }

  async getExpenseByCategory(req:Request,res:Response):Promise<Response>{
    try{
      const { clientId, expenseTimeframe,customStartDate,customEndDate } = req.query;
      const expenses = await this.expenseService.getExpenseByCategory(
        clientId as string,expenseTimeframe as string,
        customStartDate as string|undefined,customEndDate as string|undefined)
      console.log("expenses-contrll : ",expenses)
      return res.status(HttpStatusCode.OK).json({success:true,expenses});
    }catch(err){
      console.error('Error fetching expenses:', err);
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: 'Error fetching expenses' });
    }
  }

  // async exportExpense(req: Request, res: Response): Promise<void> {
  //   try {
  //     const { userId, format, startDate, endDate } = req.query;

  //     if (!userId || !format) {
  //       res.status(400).json({ message: 'User ID and format are required' });
  //       return;
  //     }

  //     const exportBuffer = await this.expenseService.exportExpense(
  //       userId as string,
  //       format as 'pdf'|'excel',
  //       startDate as string | undefined,
  //       endDate as string | undefined
  //     );

  //     if (format === 'pdf') {
  //       res.setHeader('Content-Type', 'application/pdf');
  //       res.setHeader('Content-Disposition', 'attachment; filename=expenses.pdf');
  //     } else if (format === 'excel') {
  //       res.setHeader(
  //         'Content-Type',
  //         'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  //       );
  //       res.setHeader('Content-Disposition', 'attachment; filename=expenses.xlsx');
  //     }

  //     res.send(exportBuffer);
  //   } catch (error) {
  //     console.error('Error exporting expenses:', error);
  //     res.status(500).json({ message: 'Internal Server Error' });
  //   }
  // }
}
