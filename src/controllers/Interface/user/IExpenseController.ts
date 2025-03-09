import { Request, Response } from "express";

export interface IExpenseController{
    exportExpense(req: Request, res:Response): Promise<Response | void>
}