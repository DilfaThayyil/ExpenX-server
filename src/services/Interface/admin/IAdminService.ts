import IAdvisor from "../../../entities/advisorEntities";
import IUser from "../../../entities/userEntities";
import { ICategory } from "../../../models/categorySchema";

export interface IAdminService {
  adminLogin(username:string, email: string, password: string): Promise<{ accessToken: string; refreshToken: string }>;
  fetchUsers(page: number, limit: number): Promise<{ users: IUser[]; totalPages: number }>;
  fetchAdvisors(page: number, limit: number): Promise<{ users: IAdvisor[]; totalPages: number }>;
  updateAdmin(name:string,email:string,password:string): Promise<any>
  updateUserBlockStatus(action:string,email:string):Promise<{ message: string; error?: string }>
  updateAdvisorBlockStatus(action:string,email:string):Promise<{ message: string; error?: string }>
  fetchCategories(page: number,limit: number): Promise<{ categories: ICategory[]; totalPages: number}>
  addCategory(name:string):Promise<ICategory>
  updateCategory(id:string,name:string):Promise<ICategory | null>
  deleteCategory(id:string):Promise<ICategory | null>
}
