import { DashboardData } from "../../../dto/userDTO";
import IUser from "../../../entities/userEntities";


export interface IUserService {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updateUserProfile(userData: { profilePic: string; username: string; email: string; phone: string; country: string; language: string }): Promise<any>;
    getDashboardData(userId:string):Promise<DashboardData>
    fetchUsers(page: number, limit: number, search:string): Promise<{ users: IUser[]; totalPages: number }>;
    updateUserBlockStatus(action:string,email:string):Promise<{ message: string; error?: string }>
    fetchUser(userId:string):Promise<IUser | null>
}