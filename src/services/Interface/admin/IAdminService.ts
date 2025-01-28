import IAdvisor from "../../../entities/advisorEntities";
import IUser from "../../../entities/userEntities";

export interface IAdminService {
  adminLogin(username:string, email: string, password: string): Promise<{ accessToken: string; refreshToken: string }>;
  fetchUsers(page: number, limit: number): Promise<{ users: IUser[]; totalPages: number }>;
  fetchAdvisors(page: number, limit: number): Promise<{ users: IAdvisor[]; totalPages: number }>;
  updateAdmin(name:string,email:string,password:string): Promise<any>
}
