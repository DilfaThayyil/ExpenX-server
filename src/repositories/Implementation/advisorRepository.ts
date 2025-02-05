/* eslint-disable @typescript-eslint/no-explicit-any */
import IAdvisor from '../../entities/advisorEntities';
import advisorSchema from '../../models/advisorSchema';
import slotSchema, { Slot } from '../../models/slotSchema';
import { IAdvisorRepository } from '../Interface/IAdvisorRepository';

export default class AdvisorRepository implements IAdvisorRepository {
    async findUserByEmail(email: string): Promise<any> {
        return await advisorSchema.findOne({ email });
    }

    async createUser(userData: any): Promise<any> {
        console.log("vanuuuu");
        console.log(userData,'dfghjngvvhh');
        
        return await advisorSchema.create(userData);
    }

    async updateUser(userData: any, email: string): Promise<any> {
        return await advisorSchema.findOneAndUpdate({ email }, userData, { new: true });
    }

    async fetchAdvisors(page: number, limit: number): Promise<{ users: IAdvisor[]; totalUsers: number }> {
        console.log("reppostiry...")
        const skip = (page - 1) * limit;
        const [users, totalUsers] = await Promise.all([
            advisorSchema.find().skip(skip).limit(limit),
            advisorSchema.countDocuments(),
        ]);
        console.log("skip :",skip)
        return { users, totalUsers };
    }

    async updateAdvisorStatus(email: string, isBlock: boolean): Promise<void> {
        await advisorSchema.updateOne({email},{$set:{isBlocked:isBlock}})
    }

    async createSlot(slot:Slot):Promise<any>{
        console.log("creating...")
        const result = await slotSchema.create(slot)
        return result
    }

    async findExistingSlot(date:string,startTime:string):Promise<boolean>{
        console.log("findingSlot....")
        const result = await slotSchema.findOne({date,startTime})
        return !!result
    }

    async fetchSlots():Promise<Slot[] | Slot>{
        console.log("fetching-repo....")
        return await slotSchema.find()
    }

    async findSlotById(slotId:string):Promise<Slot | null>{
        return await slotSchema.findById(slotId)
    }

    async updateSlot(slotId:string,slot:Slot):Promise<Slot | null>{
        return await slotSchema.findByIdAndUpdate(slotId,slot,{new:true})
    }

    async deleteSlot(slotId: string): Promise<boolean> {
        const result = await slotSchema.findByIdAndDelete(slotId);
        return !!result;
      }

    async findUserByRefreshToken(refreshToken: string): Promise<any> {
        return await advisorSchema.findOne({ refreshToken });
    }

    async updateRefreshToken(refreshToken: string, email: string): Promise<any> {
        return await advisorSchema.findOneAndUpdate({ email }, { refreshToken }, { new: true });
    }

    async findUserByPhoneNumber(phoneNumber: string): Promise<any> {
        return await advisorSchema.findOne({ phoneNumber });
    }

    async removeRefreshToken(email: string): Promise<any> {
        return await advisorSchema.findOneAndUpdate({ email }, { refreshToken: null }, { new: true });
    }
}
