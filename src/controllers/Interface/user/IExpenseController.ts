import { Request, Response } from "express";

export interface IExpenseController {
    getExpenses(req: Request, res: Response): Promise<void>;
    createExpense(req: Request, res: Response): Promise<void>;
    exportExpense(req: Request, res: Response): Promise<Response | void>
    getExpenseByCategory(req: Request, res: Response): Promise<Response>
}