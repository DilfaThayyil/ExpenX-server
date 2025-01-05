import { container } from 'tsyringe';
import { IUserRepository } from '../repositories/Interface/IUserRepository';
import UserRepository from '../repositories/Implementation/userRepository';
import { IUserService } from '../services/Interface/IUserService';
import UserService from '../services/Implementation/userService';
import { IUserController } from '../controllers/Interface/IUserController';
import UserController from '../controllers/Implementation/userController';

container.register<IUserController>("IUserController", { useClass: UserController });
container.register<IUserRepository>('IUserRepository', {useClass:UserRepository});
container.register<IUserService>('IUserService', {useClass:UserService});
