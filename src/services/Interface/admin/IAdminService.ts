import { CategoryData, DashboardStats, MonthlyData, UserGrowthData } from "../../../dto/adminDTO"

export interface IAdminService {
  validateCredentials(email:string,password:string):boolean
  updateAdmin(name:string,email:string,password:string): Promise<any>
  getMonthlyTrends(months?:number):Promise<MonthlyData[]>
  getExpenseCategories():Promise<CategoryData[]>
  getDashboardStats():Promise<DashboardStats>
  getUserGrowth():Promise<UserGrowthData[]>
}
