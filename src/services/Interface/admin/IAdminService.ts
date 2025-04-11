import { CategoryData, DashboardStats, MonthlyData, UserGrowthData } from "../../../dto/adminDTO"

export interface IAdminService {
  adminLogin(email:string,password:string):{admin: {
    id: string;
    email: string;
    admin: boolean;
    role: string;
  };accessToken: string;refreshToken: string;}
  setNewAccessToken(refreshToken:string):Promise<any>
  updateAdmin(name:string,email:string,password:string): Promise<any>
  getMonthlyTrends(months?:number):Promise<MonthlyData[]>
  getExpenseCategories():Promise<CategoryData[]>
  getDashboardStats():Promise<DashboardStats>
  getUserGrowth():Promise<UserGrowthData[]>
}
