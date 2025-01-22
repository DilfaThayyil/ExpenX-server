import { IUserRepository } from '../Interface/IUserRepository';
import userSchema from '../../models/userSchema';

export default class UserRepository implements IUserRepository {
    async findUserByEmail(email: string): Promise<any> {
        console.log("finding....")
        return await userSchema.findOne({ email });
    }

    async createUser(userData: any): Promise<any> {
        console.log("vanuuuu");
        console.log(userData,'dfghjngvvhh');
        
        return await userSchema.create(userData);
    }

    async updateUser(userData: any, email: string): Promise<any> {
        return await userSchema.findOneAndUpdate({ email }, userData, { new: true });
    }

    async findUserByRefreshToken(refreshToken: string): Promise<any> { 
        return await userSchema.findOne({ refreshToken });
    }

    async updateRefreshToken(refreshToken: string, email: string): Promise<any> {
        return await userSchema.findOneAndUpdate({ email }, { refreshToken }, { new: true });
    }

    async findUserByPhoneNumber(phoneNumber: string): Promise<any> {
        return await userSchema.findOne({ phoneNumber });
    }

    async removeRefreshToken(email: string): Promise<any> {
        return await userSchema.findOneAndUpdate({ email }, { refreshToken: null }, { new: true });
    }
}
