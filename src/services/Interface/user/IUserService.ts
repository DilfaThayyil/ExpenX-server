import IAdvisor from "../../../entities/advisorEntities";
import { IExpense } from "../../../entities/expenseEntities";
import { IGroup, IGroupExpense } from "../../../entities/groupEntities";
import { ICategory } from "../../../models/categorySchema";
import { IGoal } from "../../../models/goalsSchema";
import { IReport } from "../../../models/reportSchema";
import { IReview } from "../../../models/reviewSchema";
import { Slot } from "../../../models/slotSchema";
import { DashboardData } from "../../../repositories/Implementation/userRepository";

export interface IUserService {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updateUserProfile(userData: { profilePic: string; username: string; email: string; phone: string; country: string; language: string }): Promise<any>;
    getCategories():Promise<any[]>
    createGroup(userId:string,name:string,members:[string]): Promise<IGroup>
    getUserGroups(userId:string): Promise<IGroup[]>;
    addMember(groupId:string,memberEmail:string):Promise<IGroup>
    addExpenseInGroup(groupId:string,expenseData:any):Promise<IGroup>
    bookslot(slotId:string,userId:string):Promise<Slot | null>
    reportAdvisor(slotId:string,userId:string,advisorId:string,reason:string,customReason:string):Promise<IReport>
    fetchSlotsByUser(userId: string, page: number, limit: number): Promise<{ slots: Slot[], totalPages: number }>
    getAdvisors():Promise<IAdvisor[]>
    createReview(advisorId: string, userId: string, rating: number, review: string): Promise<IReview>;
    createGoal(userId: string, goalData: Partial<IGoal>): Promise<IGoal>
    getGoalsById(userId: string): Promise<IGoal[]>
    getGoalById(id:string):Promise<IGoal | null>
    updateGoal(id: string, goalData: Partial<IGoal>): Promise<IGoal | null>
    deleteGoal(id: string):Promise<boolean | null>
    updateGoalProgress(id:string,amount:number):Promise<IGoal | null>
    getDashboardData(userId:string):Promise<DashboardData>
}