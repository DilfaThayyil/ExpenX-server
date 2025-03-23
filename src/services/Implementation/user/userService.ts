import { inject, injectable } from 'tsyringe';
import { IUserRepository } from '../../../repositories/Interface/IUserRepository';
import { IUserService } from '../../Interface/user/IUserService';
import { DashboardData } from '../../../repositories/Implementation/userRepository';


@injectable()
export default class UserService implements IUserService {
  private userRepository: IUserRepository;

  constructor(
    @inject('IUserRepository') userRepository: IUserRepository,
  ) {
    this.userRepository = userRepository;
  }

  async updateUserProfile(userData: { profilePic: string; username: string; email: string; phone: string; country: string; language: string }) {
    try {
      const updatedUser = await this.userRepository.updateUser(userData, userData.email);
      console.log("updated user ; ", updatedUser)
      return updatedUser;
    } catch (error) {
      throw new Error('Error updating user in service');
    }
  }




  async getDashboardData(userId: string): Promise<DashboardData> {
    const data = await this.userRepository.getDashboardData(userId)
    return data
  }

}
