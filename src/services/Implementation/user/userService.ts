import { inject, injectable } from 'tsyringe';
import { IUserRepository } from '../../../repositories/Interface/IUserRepository';
import { IUserService } from '../../Interface/user/IUserService';
import { IExpense } from '../../../entities/expenseEntities';
import IGroup from '../../../entities/groupEntities';

@injectable()
export default class UserService implements IUserService {
  private userRepository: IUserRepository;

  constructor(@inject('IUserRepository') userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  async updateUserProfile(userData: { profilePic: string; username: string; email: string; phone: string; country: string; language: string }) {
    try {
      const updatedUser = await this.userRepository.updateUser(userData, userData.email);
      console.log("updated user ; ",updatedUser)
      return updatedUser;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new Error('Error updating user in service');
    }
  }

  async getExpensesByUserId(userId: string): Promise<IExpense[]> {
    console.log("userId from service : ",userId)
    return this.userRepository.findExpensesByUserId(userId);
  }

  async createExpense(expenseData: IExpense): Promise<IExpense> {
    return this.userRepository.createExpense(expenseData);
  }

  async createGroup(groupData: IGroup):Promise<IGroup>{
    console.log("service....")
    console.log("groupData in service: ",groupData)
    return this.userRepository.createGroup(groupData)
  }


  async getUserGroups(email:string):Promise<IGroup[]>{
    console.log("service calls....")
    const groups = await this.userRepository.getUserGroups(email)
    console.log("groups from service: ",groups)
    return groups
  }
}
