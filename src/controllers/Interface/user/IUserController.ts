import { Request, Response } from 'express';

export interface IUserController {
  uploadProfileImage(req: Request, res: Response): Promise<void>;
  updateUser(req: Request, res: Response): Promise<void>;
  getDashboardData(req: Request, res:Response): Promise<Response>
  fetchUsers(req:Request, res:Response):Promise<Response>
  updateUserBlockStatus(req:Request, res:Response):Promise<Response>

}
