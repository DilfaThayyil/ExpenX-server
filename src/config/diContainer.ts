import { container } from 'tsyringe';

//USER
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

//ADVISOR
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
import { IAdvDashboardRepo } from '../repositories/Interface/IDashboardRepository';
import AdvDashboardRepo from '../repositories/Implementation/dashboardRepository';

//ADMIN
import { IAdminController } from '../controllers/Interface/admin/IAdminController';
import AdminController from '../controllers/Implementation/admin/adminController';
import { IAdminService } from '../services/Interface/admin/IAdminService';
import AdminService from '../services/Implementation/admin/adminService';
import { IAdminRepository } from '../repositories/Interface/IAdminRepository';
import AdminRepository from '../repositories/Implementation/adminRepository';

//CHAT
import { IChatRepository } from '../repositories/Interface/IChatRepository';
import ChatRepository from '../repositories/Implementation/chatRepository';
import { IChatController } from '../controllers/Interface/chat/IChatController';
import ChatController from '../controllers/Implementation/chat/chatController';
import { IChatService } from '../services/Interface/chat/IChatService';
import ChatService from '../services/Implementation/chat/chatService';

//CATEGORY
import { ICategoryRepository } from '../repositories/Interface/ICategoryRepository';
import { CategoryRepository } from '../repositories/Implementation/categoryRepository';

//PAYMENT
import { IPaymentController } from '../controllers/Interface/user/IPaymentController';
import PaymentController from '../controllers/Implementation/user/paymentController';
import PaymentService from '../services/Implementation/user/paymentService';
import { IPaymentService } from '../services/Interface/user/IPaymentService';
import { IPaymentRepository } from '../repositories/Interface/IPaymentRepository';
import PaymentRepository from '../repositories/Implementation/paymentRepository';
import { STRIPEKEY } from './env';

//EXPENSE
import { IExpenseController } from '../controllers/Interface/user/IExpenseController';
import ExpenseController from '../controllers/Implementation/user/expenseController';
import { IExpenseService } from '../services/Interface/user/IExpenseService';
import ExpenseService from '../services/Implementation/user/expenseService';
import { IExpenseRepository } from '../repositories/Interface/IExpenseRepository';
import ExpenseRepository from '../repositories/Implementation/expenseRepository';

//GROUP
import { IGroupRepository } from '../repositories/Interface/IGroupRepository';
import GroupRepository from '../repositories/Implementation/groupRepository';

//SLOT
import { ISlotRepository } from '../repositories/Interface/ISlotRepository';
import SlotRepository from '../repositories/Implementation/slotRepository';
import { IGoalRepository } from '../repositories/Interface/IGoalRepository';
import GoalRepository from '../repositories/Implementation/goalRepository';
import { IReviewRepository } from '../repositories/Interface/IReviewRepository';
import ReviewRepository from '../repositories/Implementation/reviewRepository';
import { INotificationRepository } from '../repositories/Interface/INotificationRepository';
import NotificationRepository from '../repositories/Implementation/notificationRepository';



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
container.register<IAdvDashboardRepo>('IAdvDashboardRepo',{useClass:AdvDashboardRepo})

//admin
container.register<IAdminController>('IAdminController',{useClass: AdminController})
container.register<IAdminService>('IAdminService',{useClass:AdminService})
container.register<IAdminRepository>('IAdminRepository',{useClass:AdminRepository})

//chat
container.register<IChatController>('IChatController',{useClass:ChatController})
container.register<IChatService>('IChatService',{useClass:ChatService})
container.register<IChatRepository>('IChatRepository',{useClass:ChatRepository})

//category
container.register<ICategoryRepository>('ICategoryRepository',{useClass:CategoryRepository})

//payment
container.register<IPaymentController>('IPaymentController',{useClass:PaymentController})
container.register<IPaymentService>('IPaymentService',{useClass:PaymentService})
container.register<IPaymentRepository>('IPaymentRepository',{useClass:PaymentRepository})
container.register('StripeSecretKey', { useValue: STRIPEKEY });

//expense
container.register<IExpenseController>('IExpenseController',{useClass:ExpenseController})
container.register<IExpenseService>('IExpenseService',{useClass:ExpenseService})
container.register<IExpenseRepository>('IExpenseRepository',{useClass:ExpenseRepository})

//group
container.register<IGroupRepository>('IGroupRepository',{useClass:GroupRepository})

//slot
container.register<ISlotRepository>('ISlotRepository',{useClass:SlotRepository})

//goal
container.register<IGoalRepository>('IGoalRepository',{useClass:GoalRepository})

//review 
container.register<IReviewRepository>('IReviewRepository',{useClass:ReviewRepository})

//notification
container.register<INotificationRepository>('INotificationRepository',{useClass:NotificationRepository})