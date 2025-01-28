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
import { IAuthAdvisorController } from '../controllers/Interface/advisor/IAuthAdvisorController';
import AuthAdvisorController from '../controllers/Implementation/advisor/authAdvisorController';
import { IAuthAdvisorService } from '../services/Interface/advisor/IAuthAdvisorService';
import AuthAdvisorService from '../services/Implementation/advisor/authAdvisorService';
import { IAdvisorRepository } from '../repositories/Interface/IAdvisorRepository';
import AdvisorRepository from '../repositories/Implementation/advisorRepository';
import { IAdvisorController } from '../controllers/Interface/advisor/IAdvisorController';
import AdvisorController from '../controllers/Implementation/advisor/advisorController';
import { IAdvisorService } from '../services/Interface/advisor/IAdvisorService';
import AdvisorService from '../services/Implementation/advisor/advisorService';
import { IAdminController } from '../controllers/Interface/admin/IAdminController';


//admin
import AdminController from '../controllers/Implementation/admin/adminController';
import { IAdminService } from '../services/Interface/admin/IAdminService';
import AdminService from '../services/Implementation/admin/adminService';



//user
container.register<IAuthUserController>("IAuthUserController", { useClass: AuthUserController });
container.register<IAuthUserService>('IAuthUserService', {useClass:AuthUserService});
container.register<IUserRepository>('IUserRepository', {useClass:UserRepository});
container.register<IUserController>("IUserController",{useClass:UserController})
container.register<IUserService>("IUserService",{useClass:UserService})

//advisor
container.register<IAuthAdvisorController>('IAuthAdvisorController', {useClass: AuthAdvisorController})
container.register<IAuthAdvisorService>('IAuthAdvisorService',{useClass:AuthAdvisorService})
container.register<IAdvisorRepository>('IAdvisorRepository',{useClass:AdvisorRepository})
container.register<IAdvisorController>('IAdvisorController',{useClass:AdvisorController})
container.register<IAdvisorService>('IAdvisorService',{useClass:AdvisorService})


//admin
container.register<IAdminController>('IAdminController',{useClass: AdminController})
container.register<IAdminService>('IAdminService',{useClass:AdminService})
