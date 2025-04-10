import { MonthlyData, DashboardStats, UserGrowthData, CategoryData } from "../../dto/adminDTO"

export interface IAdminRepository{
    getMonthlyTrends(startDate?:Date,endDate?:Date):Promise<MonthlyData[]>
    getExpenseCategories():Promise<CategoryData[]>
    getDashboardStats():Promise<DashboardStats> 
    getUserGrowth():Promise<UserGrowthData[]> 
}