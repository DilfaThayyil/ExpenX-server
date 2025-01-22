import { container } from 'tsyringe';

//user
import { IAuthUserController } from '../controllers/Interface/user/IAuthUserController';
import AuthUserController from '../controllers/Implementation/user/authUserController';
import { IAuthUserService } from '../services/Interface/user/IAuthuserService';
import AuthUserService from '../services/Implementation/user/authUserService';
import { IUserRepository } from '../repositories/Interface/IUserRepository';
import UserRepository from '../repositories/Implementation/userRepository';
import { IUserController } from '../controllers/Interface/user/IUserController';
import UserController from '../controllers/Implementation/user/userController';
import { IUserService } from '../services/Interface/user/IUserService';
import UserService from '../services/Implementation/user/userService';

//advisor
import { IAdvisorController } from '../controllers/Interface/advisor/IAuthAdvisorController';
import AdvisorController from '../controllers/Implementation/advisor/authAdvisorController';
import { IAdvisorRepository } from '../repositories/Interface/IAdvisorRepository';
import AdvisorRepository from '../repositories/Implementation/advisorRepository';
import { IAdvisorService } from '../services/Interface/IAdvisorService';
import AdvisorService from '../services/Implementation/advisorService';





//user
container.register<IAuthUserController>("IAuthUserController", { useClass: AuthUserController });
container.register<IAuthUserService>('IAuthUserService', {useClass:AuthUserService});
container.register<IUserRepository>('IUserRepository', {useClass:UserRepository});
container.register<IUserController>("IUserController",{useClass:UserController})
container.register<IUserService>("IUserService",{useClass:UserService})

//advisor
container.register<IAdvisorController>('IAdvisorController', {useClass: AdvisorController})
container.register<IAdvisorService>('IAdvisorService',{useClass:AdvisorService})
container.register<IAdvisorRepository>('IAdvisorRepository',{useClass:AdvisorRepository})