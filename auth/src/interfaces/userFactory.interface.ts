import { RequestRegisterUserDTO } from '../dto';
import { User } from '../models/user.entity';

//   interface and provide that token when injecting to an interface type.
export const USER_FACTORY_SERVICE = 'USER_FACTORY_SERVICE';


export interface IUserFactory {
    DTOCreateToEntityUser(payload: RequestRegisterUserDTO): User;
}