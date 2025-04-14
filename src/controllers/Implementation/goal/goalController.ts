import {Request,Response} from 'express'
import { inject, injectable } from "tsyringe";
import { IGoalController } from "../../Interface/goal/IGoalController";
import { IGoalService } from "../../../services/Interface/goal/IGoalService";
import { HttpStatusCode } from '../../../utils/httpStatusCode';

@injectable()
export default class GoalController implements IGoalController{
    private _goalService: IGoalService

    constructor(@inject('IGoalService') goalService: IGoalService){
        this._goalService = goalService
    }

    async createGoal(req: Request, res: Response): Promise<Response> {
        try {
          const {userId} = req.params
          const { title, description, target, current, deadline, category } = req.body;
          if (!title || !target || !deadline) {
            return res.status(HttpStatusCode.BAD_REQUEST).json({ message: 'Missing required fields' });
          }
          const goal = await this._goalService.createGoal(userId, { 
            title, 
            description, 
            target: Number(target), 
            current: Number(current || 0), 
            deadline: new Date(deadline),
            category 
          });
          return res.status(HttpStatusCode.CREATED).json(goal);
        } catch (error) {
          console.error('Error creating goal:', error);
          return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Failed to create goal' });
        }
      }
    
      async getGoalsById(req: Request, res: Response): Promise<Response> {
        try {
          const { userId } = req.params;
          const goal = await this._goalService.getGoalsById(userId);  
          if (!goal) {
            return res.status(HttpStatusCode.NOT_FOUND).json({ message: 'Goal not found' });
          }
          return res.status(HttpStatusCode.OK).json(goal);
        } catch (error) {
          console.error('Error fetching goal:', error);
          return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Failed to fetch goal' });
        }
      }
    
      async updateGoal(req: Request, res: Response): Promise<Response> {
        try {
          const { id } = req.params;
          const { title, description, target, current, deadline, category } = req.body;      
          const existingGoal = await this._goalService.getGoalById(id);
          if (!existingGoal) {
          return res.status(HttpStatusCode.NOT_FOUND).json({ message: 'Goal not found' });
          }
          const updatedGoal = await this._goalService.updateGoal(id, {
            title,
            description,
            target: target !== undefined ? Number(target) : undefined,
            current: current !== undefined ? Number(current) : undefined,
            deadline: deadline ? new Date(deadline) : undefined,
            category
          });
          if (!updatedGoal) {
            return res.status(HttpStatusCode.NOT_FOUND).json({ message: 'Goal not found' });
          }
          return res.status(HttpStatusCode.OK).json(updatedGoal);
        } catch (error) {
          console.error('Error updating goal:', error);
          return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Failed to update goal' });
        }
      }
    
      async deleteGoal(req: Request, res: Response): Promise<Response> {
        try {
          const { id } = req.params;
          const existingGoal = await this._goalService.getGoalById(id);
          if (!existingGoal) {
            return res.status(HttpStatusCode.NOT_FOUND).json({ message: 'Goal not found' });
          }
          const result = await this._goalService.deleteGoal(id);
          if (!result) {
            return res.status(HttpStatusCode.NOT_FOUND).json({ message: 'Goal not found' });
          }
          return res.status(HttpStatusCode.OK).json({ message: 'Goal deleted successfully' });
        } catch (error) {
          console.error('Error deleting goal:', error);
          return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Failed to delete goal' });
        }
      }
    
      async updateGoalProgress(req: Request, res: Response): Promise<Response> {
        try {
          const { id } = req.params;
          const { amount } = req.body;
          if (amount === undefined) {
            return res.status(HttpStatusCode.BAD_REQUEST).json({ message: 'Amount is required' });
          }
          const existingGoal = await this._goalService.getGoalById(id);
          if (!existingGoal) {
            return res.status(HttpStatusCode.NOT_FOUND).json({ message: 'Goal not found' });
          }
          const updatedGoal = await this._goalService.updateGoalProgress(id, Number(amount));
          if (!updatedGoal) {
            return res.status(HttpStatusCode.NOT_FOUND).json({ message: 'Goal not found' });
          }
          return res.status(HttpStatusCode.OK).json(updatedGoal);
        } catch (error) {
          console.error('Error updating goal progress:', error);
          return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Failed to update goal progress' });
        }
      }
}