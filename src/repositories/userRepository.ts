import { User } from "../models/userSchema";
import IUser from "../entities/userEntities";

export default class UserRepository {
  async createUser(user: IUser): Promise<IUser> {
    return await User.create(user);
  }

  async findByEmail(email: string): Promise<IUser | null> {
      return await User.findOne({ email });
  }
}