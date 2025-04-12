/* eslint-disable @typescript-eslint/no-explicit-any */
import IAdvisor from '../../entities/advisorEntities';
import advisorSchema from '../../models/advisorSchema';
import { IAdvisorRepository } from '../Interface/IAdvisorRepository';
import { BaseRepository } from './baseRepository';



export default class AdvisorRepository extends BaseRepository<IAdvisor> implements IAdvisorRepository {
    constructor(){
        super(advisorSchema)
    }

    async findUserByEmail(email: string): Promise<any> {
        return this.model.findOne({ email });
    }

    async createUser(userData: any): Promise<any> {
        return this.create(userData); 
    }

    async updateUser(userData: any, email: string): Promise<any> {
        return this.model.findOneAndUpdate({ email }, userData, { new: true });
    }

    async fetchAdvisors(page: number, limit: number): Promise<{ users: IAdvisor[]; totalUsers: number }> {
        const skip = (page - 1) * limit;
        const [users, totalUsers] = await Promise.all([
            this.model.find().skip(skip).limit(limit),
            this.model.countDocuments(),
        ]);
        return { users, totalUsers };
    }

    async updateAdvisorStatus(email: string, isBlock: boolean): Promise<void> {
        await this.model.updateOne({ email }, { $set: { isBlocked: isBlock } })
    }

    async findUserById(id: string): Promise<IAdvisor | null> {
        return await advisorSchema.findById(id)
    }

    async getAdvisors(): Promise<IAdvisor[]> {
        const advisors = await advisorSchema.find({ isBlocked: false })
        return advisors
    }

    async updateRefreshToken(refreshToken: string, email: string): Promise<any> {
        return await advisorSchema.findOneAndUpdate({ email }, { refreshToken }, { new: true });
    }

    async removeRefreshToken(email: string): Promise<any> {
        return await advisorSchema.findOneAndUpdate({ email }, { refreshToken: null }, { new: true });
    }



}
