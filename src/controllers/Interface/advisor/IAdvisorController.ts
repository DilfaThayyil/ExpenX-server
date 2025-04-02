import { Request, Response } from 'express';

export interface IAdvisorController {
  uploadProfileImage(req: Request, res: Response): Promise<void>;
  updateUser(req: Request, res: Response): Promise<void>;
  fetchDashboard(req: Request, res: Response): Promise<Response>
  fetchRevenue(req: Request, res: Response): Promise<Response>
  fetchClientGoals(req: Request, res: Response): Promise<Response>
  getUpcomingAppointments(req: Request, res: Response): Promise<Response>
  getRecentClients(req: Request,res:Response): Promise<Response>
  getAdvisors(req: Request, res:Response): Promise<Response>
  fetchAdvisors(req:Request, res:Response):Promise<Response>
  updateAdvisorBlockStatus(req:Request, res:Response):Promise<Response>
  getClientMeetings(req:Request,res:Response):Promise<Response>
}
