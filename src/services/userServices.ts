import bcrypt from 'bcrypt';
import IUser from '../entities/userEntities';
import UserRepository from '../repositories/userRepository';
import CheckuserExists from './checkUserExist';

const isValidateEmail = (email: string): boolean => {
  const allowedDomains = ['gmail.com', 'outlook.com', 'icloud.com', 'yahoo.com'];
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return false;
  }
  const domain = email.split('@')[1];
  return allowedDomains.includes(domain);
}
const isValidatePassword = (password: string): boolean => {
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
  return passwordRegex.test(password);
}


export default class RegisterUser {
  private userRepository: UserRepository
  private checkUserExistsUseCase: CheckuserExists

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository
    this.checkUserExistsUseCase = new CheckuserExists(userRepository)
  }
  async registr(userInput: IUser): Promise<void> {
    const emailExists = await this.userRepository.findUserByEmail(userInput.email);
    if (emailExists) {
      throw new Error('Email is already in use');
    }
    if (!isValidateEmail(userInput.email)) {
      throw new Error('Invalid email format');
    }
    if (!isValidatePassword(userInput.password)) {
      throw new Error('Weak password');
    }
    userInput.password = await bcrypt.hash(userInput.password, 10);
    await this.userRepository.createUser(userInput);
  }
}
