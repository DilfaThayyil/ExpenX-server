import { Container } from 'inversify';
import { IUserService } from '../services/Interface/IUserService';
import { UserService } from '../services/Implementation/userService';

const container = new Container();
container.bind<IUserService>('IUserService').to(UserService);

export { container };
