import IUser from "../../entities/userEntities";
import { DashboardData } from "../Implementation/userRepository";

export interface IUserRepository {
  findUserByEmail(email: string): Promise<any>;
  createUser(userData: any): Promise<any>;
  updateUser(userData: any, email: string): Promise<any>;
  fetchUsers(page: number, limit: number): Promise<{ users: IUser[]; totalUsers: number }>;
  findAdmin():Promise<any>
  updateAdmin(admin:any):Promise<any>
  updateUserStatus(email:string, isBlock:boolean):Promise<void>
  findByEmail(email: string): Promise<IUser | null>
  findUserById(userId:string):Promise<IUser | null>
  getDashboardData(userId:string):Promise<DashboardData>
}