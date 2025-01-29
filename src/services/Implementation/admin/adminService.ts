import { inject, injectable } from "tsyringe";
import { IAdminService } from "../../Interface/admin/IAdminService";
import { IUserRepository } from "../../../repositories/Interface/IUserRepository";
import IUser from "../../../entities/userEntities";
import { IAdvisorRepository } from "../../../repositories/Interface/IAdvisorRepository";
import bcrypt from 'bcrypt';
import { generateAccessToken, generateRefreshToken } from "../../../utils/jwt";



@injectable()
export default class AdminService implements IAdminService {
    private userRepository: IUserRepository
    private advisorRepository: IAdvisorRepository;

    constructor(
        @inject('IUserRepository') userRepository: IUserRepository,
        @inject('IAdvisorRepository') advisorRepository: IAdvisorRepository
    ) {
        this.userRepository = userRepository
        this.advisorRepository = advisorRepository
    }


    async adminLogin(username: string, email: string, password: string): Promise<{ accessToken: string; refreshToken: string; admin: any }> {
        const admin = await this.userRepository.findAdmin();
        console.log("admin-service : ", admin);
        if (!admin) {
            throw new Error('No admin found');
        }
        if (!admin.password) {
            admin.username = username;
            admin.email = email;
            admin.password = await bcrypt.hash(password, 10);
            const updatedUser = await this.userRepository.updateAdmin(admin)
            console.log('Admin credentials saved : ',updatedUser);
        } else {
            const validPassword = await bcrypt.compare(password, admin.password);
            if (!validPassword) {
                throw new Error('Invalid credentials');
            }
            console.log("isValidPassword : ", validPassword);
        }
        const accessToken = generateAccessToken(admin);
        const refreshToken = generateRefreshToken(admin);
        console.log("accessToken : ", accessToken);
        console.log("refreshToken : ", refreshToken);
        admin.accessToken = accessToken;
        admin.refreshToken = refreshToken;
        console.log("admin-service : ",admin)
        return { accessToken, refreshToken, admin };
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


    async updateAdmin(name:string,email:string,password:string):Promise<any>{
        try{
            const hashedPassword = await bcrypt.hash(password,10)
            const admin={username:name,email,password:hashedPassword}
            console.log("admin-service : ",admin)
            const updatedAdmin = await this.userRepository.updateAdmin(admin)
            console.log('updatedAdmin-service : ',updatedAdmin)
            return updatedAdmin
        }catch(err){
            console.error(err)
            throw new Error('Error updating admin in service')
        }
    }


    async updateUserBlockStatus(action: string, email: string): Promise<{ message: string; error?: string }> {
        try{
            const isBlocked = action === 'block'
            await this.userRepository.updateUserStatus(email, isBlocked)
            return {message : `User ${action}ed successfully`}
        }catch(err){
            const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
            return {message : 'Failed to update user status ',error:errorMessage}
        }
    }


    async updateAdvisorBlockStatus(action: string, email: string): Promise<{ message: string; error?: string }> {
        try{
            const isBlocked = action === 'block'
            await this.advisorRepository.updateAdvisorStatus(email, isBlocked)
            return {message : `Advisor ${action}ed successfully`}
        }catch(err){
            const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
            return {message : 'Failed to update advisor status ',error:errorMessage}
        }
    }


    // async getDashboardData(): Promise<any> {
    //     return this.adminRepository.getDashboardData();
    // }

}