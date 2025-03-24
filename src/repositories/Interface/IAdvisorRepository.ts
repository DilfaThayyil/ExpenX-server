import IAdvisor from "../../entities/advisorEntities";
import { IReport } from "../../models/reportSchema";


/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IAdvisorRepository {
    findUserByEmail(email: string): Promise<any>;
    createUser(userData: any): Promise<any>;
    updateUser(userData: any, email: string): Promise<any>;
    fetchAdvisors(page: number, limit: number): Promise<{ users: IAdvisor[]; totalUsers: number }>;
    findUserByRefreshToken(refreshToken: string): Promise<any>;
    updateRefreshToken(refreshToken: string, email: string): Promise<any>;
    removeRefreshToken(email: string): Promise<any>;
    updateAdvisorStatus(email:string, isBlock:boolean): Promise<void>
    findUserById(id:string):Promise<IAdvisor | null>
    getAdvisors():Promise<IAdvisor[]>
  }
  