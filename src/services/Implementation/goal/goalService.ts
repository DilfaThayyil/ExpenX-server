import { inject, injectable } from "tsyringe";
import { IGoalService } from "../../Interface/goal/IGoalService";
import { IGoalRepository } from "../../../repositories/Interface/IGoalRepository";
import { IGoal } from "../../../models/goalsSchema";

@injectable()
export default class GoalService implements IGoalService{
    private goalRepository: IGoalRepository
    
    constructor(@inject('IGoalRepository') goalRepository: IGoalRepository){
        this.goalRepository = goalRepository
    }

    async createGoal(userId: string, goalData: Partial<IGoal>): Promise<IGoal> {
        const goal = await this.goalRepository.createGoal({ ...goalData, userId });
        return goal
      }
      async getGoalsById(userId: string): Promise<IGoal[]> {
        const goals = await this.goalRepository.getGoalsById(userId);
        return goals
      }
      async getGoalById(id: string): Promise<IGoal | null> {
        const goal = await this.goalRepository.getGoalById(id)
        return goal
      }
      async updateGoal(id: string, goalData: Partial<IGoal>): Promise<IGoal | null> {
        const updatedGoal = await this.goalRepository.updateGoal(id, goalData)
        return updatedGoal
      }
      async deleteGoal(id: string): Promise<boolean | null> {
        return await this.goalRepository.deleteGoal(id);
      }
    
      async updateGoalProgress(id: string, amount: number): Promise<IGoal | null> {
        const goal = await this.goalRepository.getGoalById(id);
        if (!goal) return null;
        const newAmount = goal.current + amount;
        const current = Math.max(0, Math.min(goal.target, newAmount));
        return this.goalRepository.updateGoal(id, { current });
      }
}