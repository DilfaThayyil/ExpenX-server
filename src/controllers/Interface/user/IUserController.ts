import { Request, Response } from 'express';

export interface IUserController {
  uploadProfileImage(req: Request, res: Response): Promise<void>;
  updateUser(req: Request, res: Response): Promise<void>;
  getExpenses(req: Request, res: Response): Promise<void>;
  createExpense(req: Request, res: Response): Promise<void>;
  createGroup(req: Request, res: Response): Promise<Response>
  getUserGroups(req: Request, res:Response): Promise<Response>
  addMember(req: Request, res:Response): Promise<void>
  addExpenseInGroup(req: Request, res:Response): Promise<Response>
  bookslot(req: Request, res: Response): Promise<void>
  reportAdvisor(req:Request, res:Response): Promise<Response>
  fetchSlotsByUser(req:Request, res:Response): Promise<Response>
  getAdvisors(req: Request, res:Response): Promise<Response>
  createReview(req: Request, res:Response): Promise<Response>
}
