import User from '../models/userSchema';
import IUser from '../entities/userEntities';


interface IUserInput {
  username: string;
  email: string;
  password: string;
}

export default class UserRepository {
  async createUser(userInput: IUserInput): Promise<IUser> {
    return await User.create(userInput);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email });
  }
}
