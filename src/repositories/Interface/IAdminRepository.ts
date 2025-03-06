import { CategoryData, DashboardStats, MonthlyData, UserGrowthData } from "../Implementation/adminRepository";

export interface IAdminRepository{
    getMonthlyTrends(startDate?:Date,endDate?:Date):Promise<MonthlyData[]>
    getExpenseCategories():Promise<CategoryData[]>
    getDashboardStats():Promise<DashboardStats> 
    getUserGrowth():Promise<UserGrowthData[]> 
}