import { inject, injectable } from "tsyringe";
import { IAdminService } from "../../Interface/admin/IAdminService";
import { IUserRepository } from "../../../repositories/Interface/IUserRepository";
import IUser from "../../../entities/userEntities";
import { IAdvisorRepository } from "../../../repositories/Interface/IAdvisorRepository";
import bcrypt from 'bcrypt';
import { generateAccessToken, generateRefreshToken } from "../../../utils/jwt";
import { ICategoryRepository } from "../../../repositories/Interface/ICategoryRepository";
import { ICategory } from "../../../models/categorySchema";
import { ADMINEMAIL, ADMINPASSWORD } from "../../../config/env";
import IAdvisor from "../../../entities/advisorEntities";
import { IReport } from "../../../models/reportSchema";



@injectable()
export default class AdminService implements IAdminService {
    private userRepository: IUserRepository
    private advisorRepository: IAdvisorRepository;
    private categoryRepository: ICategoryRepository

    constructor(
        @inject('IUserRepository') userRepository: IUserRepository,
        @inject('IAdvisorRepository') advisorRepository: IAdvisorRepository,
        @inject('ICategoryRepository') categoryRepository: ICategoryRepository
    ) {
        this.userRepository = userRepository
        this.advisorRepository = advisorRepository
        this.categoryRepository = categoryRepository
    }

    validateCredentials(email: string, password: string): boolean {
        return email === ADMINEMAIL && password === ADMINPASSWORD;
    }

    // async adminLogin(email: string, password: string): Promise<{ accessToken: string; refreshToken: string; admin: any }> {
    //     const admin = await this.userRepository.findAdmin();
    //     console.log("admin-service : ", admin);
    //     if (!admin) {
    //         throw new Error('No admin found');
    //     }
    //     if (!admin.password) {
    //         admin.email = email;
    //         admin.password = await bcrypt.hash(password, 10);
    //         const updatedUser = await this.userRepository.updateAdmin(admin)
    //         console.log('Admin credentials saved : ',updatedUser);
    //     } else {
    //         const validPassword = await bcrypt.compare(password, admin.password);
    //         if (!validPassword) {
    //             throw new Error('Invalid credentials');
    //         }
    //         console.log("isValidPassword : ", validPassword);
    //     }
    //     const accessToken = generateAccessToken(admin);
    //     const refreshToken = generateRefreshToken(admin);
    //     console.log("accessToken : ", accessToken);
    //     console.log("refreshToken : ", refreshToken);
    //     admin.accessToken = accessToken;
    //     admin.refreshToken = refreshToken;
    //     console.log("admin-service : ",admin)
    //     return { accessToken, refreshToken, admin };
    // }



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
        const existingCategory = await this.categoryRepository.findCategory(name)
        if (existingCategory) {
            throw new Error('Category already exist')
        }
        const category = await this.categoryRepository.addCategory(name)
        console.log("category-service :", category)
        return category
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



    async fetchReports(page:number,limit:number){
        const report = await this.advisorRepository.fetchReports(page,limit);
        console.log("fetchReport-service : ",report)
        return report
    }
}