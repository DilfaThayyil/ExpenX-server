import IAdvisor from "../../entities/advisorEntities";
import { Slot } from "../../models/slotSchema";

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IAdvisorRepository {
    findUserByEmail(email: string): Promise<any>;
    createUser(userData: any): Promise<any>;
    updateUser(userData: any, email: string): Promise<any>;
    fetchAdvisors(page: number, limit: number): Promise<{ users: IAdvisor[]; totalUsers: number }>;
    findUserByRefreshToken(refreshToken: string): Promise<any>;
    updateRefreshToken(refreshToken: string, email: string): Promise<any>;
    findUserByPhoneNumber(phoneNumber: string): Promise<any>;
    removeRefreshToken(email: string): Promise<any>;
    updateAdvisorStatus(email:string, isBlock:boolean): Promise<void>
    createSlot(slotData:Slot):Promise<Slot>
    findExistingSlot(date:string,startTime:string):Promise<Slot | null>
    fetchSlots():Promise<Slot[] | Slot>
    findSlotById(slotId:string):Promise<Slot | null>
    updateSlot(slotId:string,slot:Slot):Promise<Slot | null>
  }
  