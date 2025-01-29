/* eslint-disable @typescript-eslint/no-explicit-any */
import IAdvisor from '../../entities/advisorEntities';
import advisorSchema from '../../models/advisorSchema';
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
