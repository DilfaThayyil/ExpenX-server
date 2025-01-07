import { container } from 'tsyringe';
import { IUserRepository } from '../repositories/Interface/IUserRepository';
import UserRepository from '../repositories/Implementation/userRepository';
import { IUserService } from '../services/Interface/IUserService';
import UserService from '../services/Implementation/userService';
import { IUserController } from '../controllers/Interface/IUserController';
import UserController from '../controllers/Implementation/userController';
import { IAdvisorController } from '../controllers/Interface/IAdvisorController';
import AdvisorController from '../controllers/Implementation/advisorController';
import { IAdvisorRepository } from '../repositories/Interface/IAdvisorRepository';
import AdvisorRepository from '../repositories/Implementation/advisorRepository';
import { IAdvisorService } from '../services/Interface/IAdvisorService';
import AdvisorService from '../services/Implementation/advisorService';


container.register<IAdvisorService>('IAdvisorService',{useClass:AdvisorService})
container.register<IAdvisorRepository>('IAdvisorRepository',{useClass:AdvisorRepository})
container.register<IAdvisorController>('IAdvisorController', {useClass: AdvisorController})
container.register<IUserController>("IUserController", { useClass: UserController });
container.register<IUserRepository>('IUserRepository', {useClass:UserRepository});
container.register<IUserService>('IUserService', {useClass:UserService});
