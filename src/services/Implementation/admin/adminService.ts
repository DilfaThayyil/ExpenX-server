import { inject, injectable } from "tsyringe";
import { IAdminService } from "../../Interface/admin/IAdminService";
import { IUserRepository } from "../../../repositories/Interface/IUserRepository";
import IUser from "../../../entities/userEntities";
import { IAdvisorRepository } from "../../../repositories/Interface/IAdvisorRepository";
import bcrypt from 'bcrypt';
import { ICategoryRepository } from "../../../repositories/Interface/ICategoryRepository";
import { ICategory } from "../../../models/categorySchema";
import { ADMINEMAIL, ADMINPASSWORD } from "../../../config/env";
import { IReport } from "../../../models/reportSchema";
import { IAdminRepository } from "../../../repositories/Interface/IAdminRepository";
import { CategoryData, DashboardStats, MonthlyData, UserGrowthData } from "../../../repositories/Implementation/adminRepository";



@injectable()
export default class AdminService implements IAdminService {
    private userRepository: IUserRepository
    private advisorRepository: IAdvisorRepository;
    private categoryRepository: ICategoryRepository
    private adminRepository: IAdminRepository

    constructor(
        @inject('IUserRepository') userRepository: IUserRepository,
        @inject('IAdvisorRepository') advisorRepository: IAdvisorRepository,
        @inject('ICategoryRepository') categoryRepository: ICategoryRepository,
        @inject('IAdminRepository') adminRepository: IAdminRepository
    ) {
        this.userRepository = userRepository
        this.advisorRepository = advisorRepository
        this.categoryRepository = categoryRepository
        this.adminRepository = adminRepository
    }

    validateCredentials(email: string, password: string): boolean {
        return email === ADMINEMAIL && password === ADMINPASSWORD;
    }

    async fetchUsers(page: number, limit: number): Promise<{ users: IUser[]; totalPages: number }> {
        console.log("service....")
        const { users, totalUsers } = await this.userRepository.fetchUsers(page, limit);
        const totalPages = Math.ceil(totalUsers / limit);
        console.log()
        return { users, totalPages };
    }

    async fetchAdvisors(page: number, limit: number): Promise<{ users: IUser[]; totalPages: number }> {
        console.log("service....")
        const { users, totalUsers } = await this.advisorRepository.fetchAdvisors(page, limit);
        const totalPages = Math.ceil(totalUsers / limit);
        console.log()
        return { users, totalPages };
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

    async updateUserBlockStatus(action: string, email: string): Promise<{ message: string; error?: string }> {
        try {
            const isBlocked = action === 'block'
            await this.userRepository.updateUserStatus(email, isBlocked)
            return { message: `User ${action}ed successfully` }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
            return { message: 'Failed to update user status ', error: errorMessage }
        }
    }

    async updateAdvisorBlockStatus(action: string, email: string): Promise<{ message: string; error?: string }> {
        try {
            const isBlocked = action === 'block'
            await this.advisorRepository.updateAdvisorStatus(email, isBlocked)
            return { message: `Advisor ${action}ed successfully` }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
            return { message: 'Failed to update advisor status ', error: errorMessage }
        }
    }

    async fetchCategories(page: number, limit: number): Promise<{ categories: ICategory[]; totalPages: number }> {
        console.log("service-category..")
        const { categories, totalCategories } = await this.categoryRepository.fetchCategories(page, limit);
        const totalPages = Math.ceil(totalCategories / limit);
        return { categories, totalPages };
    }

    async addCategory(name: string): Promise<ICategory> {
        const existingCategory = await this.categoryRepository.findCategory(name);
        if (existingCategory) {
            throw new Error("CATEGORY_EXISTS");
        }
        const category = await this.categoryRepository.addCategory(name);
        return category;
    }
    

    async updateCategory(id: string, name: string): Promise<ICategory | null> {
        const updatedCategory = await this.categoryRepository.updateCategory(id, name)
        console.log("updtCategry: ", updatedCategory)
        return updatedCategory
    }

    async deleteCategory(id: string): Promise<ICategory | null> {
        const deleteCategory = await this.categoryRepository.deleteCategory(id)
        console.log("deleteCategory-serv : ", deleteCategory)
        return deleteCategory
    }

    async fetchReports(page:number,limit:number):Promise<{reports:IReport[], totalReports:number}>{
        const report = await this.advisorRepository.fetchReports(page,limit);
        console.log("fetchReport-service : ",report)
        return report
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
        console.log("data-expenseCatgry-service : ",data)
        return data
      }
    
      async getDashboardStats(): Promise<DashboardStats> {
        return this.adminRepository.getDashboardStats();
      }

      async getUserGrowth(): Promise<UserGrowthData[]> {
        return this.adminRepository.getUserGrowth();
      }
}