import { Request, Response } from 'express';

export interface IAdvisorController {
  uploadProfileImage(req: Request, res: Response): Promise<void>;
  updateUser(req: Request, res: Response): Promise<void>;
  createSlot(req:Request,res:Response): Promise<void>
  fetchSlots(req:Request,res:Response): Promise<Response>
  updateSlot(req:Request,res:Response): Promise<void>
  deleteSlot(req:Request,res:Response): Promise<void>
  getBookedSlotsForAdvisor(req: Request, res: Response): Promise<Response>
  fetchReviews(req: Request, res: Response): Promise<Response>
  addReplyToReview(req: Request, res: Response): Promise<Response>
  fetchDashboard(req: Request, res: Response): Promise<Response>
  fetchRevenue(req: Request, res: Response): Promise<Response>
  fetchClientGoals(req: Request, res: Response): Promise<Response>
  getUpcomingAppointments(req: Request, res: Response): Promise<Response>
  getRecentClients(req: Request,res:Response): Promise<Response>
  getAdvisors(req: Request, res:Response): Promise<Response>
}
