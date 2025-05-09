import { inject, injectable } from 'tsyringe';
import { IUserRepository } from '../../../repositories/Interface/IUserRepository';
import { IUserService } from '../../Interface/user/IUserService';
import IUser from '../../../entities/userEntities';
import { DashboardData } from '../../../dto/userDTO';


@injectable()
export default class UserService implements IUserService {
  private _userRepository: IUserRepository;

  constructor(
    @inject('IUserRepository') userRepository: IUserRepository,
  ) {
    this._userRepository = userRepository;
  }

  async updateUserProfile(userData: { profilePic: string; username: string; email: string; phone: string; country: string; language: string }) {
    try {
      const updatedUser = await this._userRepository.updateUser(userData, userData.email);
      return updatedUser;
    } catch (error) {
      throw new Error('Error updating user in service');
    }
  }

  async fetchUsers(page: number, limit: number,search:string): Promise<{ users: IUser[]; totalPages: number }> {
    const { users, totalUsers } = await this._userRepository.fetchUsers(page, limit,search);
    const totalPages = Math.ceil(totalUsers / limit);
    return { users, totalPages };
  }

  async getDashboardData(userId: string): Promise<DashboardData> {
    const data = await this._userRepository.getDashboardData(userId)
    return data
  }

  async updateUserBlockStatus(action: string, email: string): Promise<{ message: string; error?: string }> {
    try {
      const isBlocked = action === 'block'
      await this._userRepository.updateUserStatus(email, isBlocked)
      return { message: `User ${action}ed successfully` }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      return { message: 'Failed to update user status ', error: errorMessage }
    }
  }

  async fetchUser(userId:string):Promise<IUser|null>{
    const user = await this._userRepository.findUserById(userId)
    return user
  }

  async findByEmail(email:string):Promise<IUser | null>{
    return await this._userRepository.findByEmail(email)
  }

}
