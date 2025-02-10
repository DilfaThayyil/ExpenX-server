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
    removeRefreshToken(email: string): Promise<any>;
    updateAdvisorStatus(email:string, isBlock:boolean): Promise<void>
    createSlot(slotData:Slot):Promise<Slot>
    findExistingSlot(date:string,startTime:string):Promise<boolean>
    fetchSlots(page:number,limit:number):Promise<{slots:Slot[] | Slot; totalSlots:number}>
    findSlotById(slotId:string):Promise<Slot | null>
    updateSlot(slotId:string,slot:Slot):Promise<Slot | null>
    deleteSlot(slotId:string):Promise<boolean>
    getBookedSlotsForAdvisor(advisorid:string,page:number,limit:number):Promise<{bookedSlots:Slot[] | Slot; totalSlots:number}>
  }
  