import { IUserRepository } from '../Interface/IUserRepository';
import userSchema from '../../models/userSchema';
import { IExpense } from '../../entities/expenseEntities';
import expenseSchema from '../../models/expenseSchema';
import IGroup from '../../entities/groupEntities';
import groupSchema from '../../models/groupSchema';
import IUser from '../../entities/userEntities';



export default class UserRepository implements IUserRepository {

    async findUserByEmail(email: string): Promise<any> {
        console.log("finding....")
        return await userSchema.findOne({ email });
    }
    
    async createUser(userData: any): Promise<any> {
        console.log("vanuuuu");
        console.log(userData, 'dfghjngvvhh');
        
        return await userSchema.create(userData);
    }

    async updateUser(userData: any, email: string): Promise<any> {
        return await userSchema.findOneAndUpdate({ email }, userData, { new: true });
    }

    async findExpensesByUserId(userId: string): Promise<IExpense[]> {
        console.log("userId from repository: ", userId)
        const expense = await expenseSchema.find({ userId });
        console.log("expense from repo : ", expense)
        return expense
    }

    async createExpense(expenseData: IExpense): Promise<IExpense> {
        return expenseSchema.create(expenseData);
    }
    
    async createGroup(groupData: IGroup): Promise<IGroup> {
        console.log("repo calling...")
        console.log("groupData in repo : ", groupData)
        return groupSchema.create(groupData)
    }
    
    async getUserGroups(email: string): Promise<IGroup[]> {
        return groupSchema.find({ members: email });
    }
    

    async fetchUsers(page: number, limit: number): Promise<{ users: IUser[]; totalUsers: number }> {
        const skip = (page - 1) * limit;
        console.log("Fetching users, skip:", skip);
        
        const [users, totalUsers] = await Promise.all([
            userSchema.find({ isAdmin: false }).skip(skip).limit(limit),
            userSchema.countDocuments({ isAdmin: false }), 
        ]);
        
        return { users, totalUsers };
    }

    
    async findAdmin():Promise<any>{
        return await userSchema.findOne({isAdmin:true})
    }

    async updateAdmin(admin: any): Promise<any> { 
        console.log("admin-repo : ",admin)
        return await userSchema.findOneAndUpdate({ isAdmin: true }, admin, { new: true });
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
