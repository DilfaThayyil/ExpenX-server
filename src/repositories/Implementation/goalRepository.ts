import goalsSchema, { IGoal } from "../../models/goalsSchema";
import { IGoalRepository } from "../Interface/IGoalRepository";
import { BaseRepository } from "./baseRepository";

export default class GoalRepository extends BaseRepository<IGoal> implements IGoalRepository{
    constructor(){
        super(goalsSchema)
    }
    async createGoal(goalData: Partial<IGoal>): Promise<IGoal> {
        const goal = await goalsSchema.create(goalData);
        return goal
    }
    async getGoalsById(userId: string): Promise<IGoal[]> {
        const goals = await goalsSchema.find({ userId }).sort({ deadline: 1 });
        return goals
    }
    async getGoalById(id: string): Promise<IGoal | null> {
        return await goalsSchema.findById(id)
    }
    async updateGoal(id: string, goalData: Partial<IGoal>): Promise<IGoal | null> {
        return await goalsSchema.findByIdAndUpdate(id, { ...goalData, updatedAt: new Date() }, { new: true })
    }
    async deleteGoal(id: string): Promise<boolean | null> {
        return await goalsSchema.findByIdAndDelete(id)
    }
}