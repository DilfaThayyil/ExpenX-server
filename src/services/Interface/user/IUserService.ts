import { DashboardData } from "../../../repositories/Implementation/userRepository";

export interface IUserService {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updateUserProfile(userData: { profilePic: string; username: string; email: string; phone: string; country: string; language: string }): Promise<any>;
    getDashboardData(userId:string):Promise<DashboardData>
}