import { Request, Response } from 'express';

export interface IAdvisorController {
  uploadProfileImage(req: Request, res: Response): Promise<void>;
  updateUser(req: Request, res: Response): Promise<void>;
}
