import { IGoal } from "../../../models/goalsSchema"

export interface IGoalService{
    createGoal(userId: string, goalData: Partial<IGoal>): Promise<IGoal>
    getGoalsById(userId: string): Promise<IGoal[]>
    getGoalById(id:string):Promise<IGoal | null>
    updateGoal(id: string, goalData: Partial<IGoal>): Promise<IGoal | null>
    deleteGoal(id: string):Promise<boolean | null>
    updateGoalProgress(id:string,amount:number):Promise<IGoal | null>
}