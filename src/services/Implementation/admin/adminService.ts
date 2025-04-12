import { inject, injectable } from "tsyringe";
import { IAdminService } from "../../Interface/admin/IAdminService";
import { IUserRepository } from "../../../repositories/Interface/IUserRepository";
import { IAdvisorRepository } from "../../../repositories/Interface/IAdvisorRepository";
import bcrypt from 'bcrypt';
import { ADMINEMAIL, ADMINPASSWORD } from "../../../config/env";
import { IAdminRepository } from "../../../repositories/Interface/IAdminRepository";
import { MonthlyData, DashboardStats, UserGrowthData, CategoryData } from "../../../dto/adminDTO";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../../../utils/jwt";
import { messageConstants } from "../../../utils/messageConstants";
import redisClient from "../../../utils/redisClient";



@injectable()
export default class AdminService implements IAdminService {
  private userRepository: IUserRepository
  private advisorRepository: IAdvisorRepository;
  private adminRepository: IAdminRepository

  constructor(
    @inject('IUserRepository') userRepository: IUserRepository,
    @inject('IAdvisorRepository') advisorRepository: IAdvisorRepository,
    @inject('IAdminRepository') adminRepository: IAdminRepository
  ) {
    this.userRepository = userRepository
    this.advisorRepository = advisorRepository
    this.adminRepository = adminRepository
  }

  adminLogin(email: string, password: string): {
    admin: {
      id: string; email: string; admin: boolean; role: string;
    }; accessToken: string; refreshToken: string;
  } {
    if (!ADMINEMAIL || !ADMINPASSWORD) {
      throw new Error("Admin credentials are not set in environment variables");
    }
    if (email !== ADMINEMAIL || password !== ADMINPASSWORD) {
      throw new Error('Invalid admin credentials')
    }
    const admin = {
      id: 'admin-001',
      email,
      admin: true,
      role: 'admin'
    }
    const accessToken = generateAccessToken(admin)
    const refreshToken = generateRefreshToken(admin)
    return { admin, accessToken, refreshToken }
  }

  async setNewAccessToken(refreshToken:string):Promise<any>{
    try{
      const isBlacklisted = await redisClient.get(`bl:${refreshToken}`);
      if (isBlacklisted) throw new Error("Refresh token expired or blacklisted");
      const decoded = verifyRefreshToken(refreshToken)
      const accessToken = generateAccessToken(decoded)
      return {
        accessToken,
        message: messageConstants.TOKEN_SUCCESS,
        success: true,
        user: decoded
      }
    }catch(err:any){
      throw new Error("Error generating new access token : "+err.message)
    }
  }

  async updateAdmin(name: string, email: string, password: string): Promise<any> {
    try {
      const hashedPassword = await bcrypt.hash(password, 10)
      const admin = { username: name, email, password: hashedPassword }
      console.log("admin-service : ", admin)
      const updatedAdmin = await this.userRepository.updateAdmin(admin)
      console.log('updatedAdmin-service : ', updatedAdmin)
      return updatedAdmin
    } catch (err) {
      console.error(err)
      throw new Error('Error updating admin in service')
    }
  }

  async getMonthlyTrends(months: number = 6): Promise<MonthlyData[]> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);
    const data = await this.adminRepository.getMonthlyTrends(startDate, endDate);
    const result: MonthlyData[] = [];
    for (let i = 0; i < months; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() - (months - 1 - i));
      const monthStr = date.toLocaleString('default', { month: 'short' });
      const existingData = data.find(item => item.month === monthStr);
      if (existingData) {
        result.push(existingData);
      } else {
        result.push({
          month: monthStr,
          expenses: 0,
          income: 0,
          users: 0
        });
      }
    }
    return result;
  }

  async getExpenseCategories(): Promise<CategoryData[]> {
    const data = await this.adminRepository.getExpenseCategories();
    return data
  }

  async getDashboardStats(): Promise<DashboardStats> {
    return this.adminRepository.getDashboardStats();
  }

  async getUserGrowth(): Promise<UserGrowthData[]> {
    return this.adminRepository.getUserGrowth();
  }
}