import { CategoryData, DashboardStats, MonthlyData, UserGrowthData } from "../../../repositories/Implementation/adminRepository";

export interface IAdminService {
  validateCredentials(email:string,password:string):boolean
  updateAdmin(name:string,email:string,password:string): Promise<any>
  getMonthlyTrends(months?:number):Promise<MonthlyData[]>
  getExpenseCategories():Promise<CategoryData[]>
  getDashboardStats():Promise<DashboardStats>
  getUserGrowth():Promise<UserGrowthData[]>
}
