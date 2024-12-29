import User from '../models/userSchema';
import IUser from '../entities/userEntities';


interface IUserInput {
  username: string;
  email: string;
  password: string;
}

export default class UserRepository {
  static findUserByEmail(arg0: { email: string; }) {
    throw new Error('Method not implemented.');
  }
  async createUser(userInput: IUserInput): Promise<IUser> {
    return await User.create(userInput);
  }

  async findUserByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email });
  }
}
