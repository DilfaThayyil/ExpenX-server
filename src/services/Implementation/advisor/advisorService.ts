import { inject, injectable } from 'tsyringe';
import { IAdvisorRepository } from '../../../repositories/Interface/IAdvisorRepository';
import { IAdvisorService } from '../../Interface/advisor/IAdvisorService';


@injectable()
export default class AdvisorService implements IAdvisorService {
  private advisorRepository: IAdvisorRepository;

  constructor(@inject('IAdvisorRepository') advisorRepository: IAdvisorRepository) {
    this.advisorRepository = advisorRepository;
  }

  async updateUserProfile(userData: { profilePic: string; username: string; email: string; phone: string; country: string; language: string }) {
    try {
      const updatedUser = await this.advisorRepository.updateUser(userData, userData.email);
      console.log("updated user ; ",updatedUser)
      return updatedUser;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new Error('Error updating user in service');
    }
  }


}
