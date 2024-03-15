import { Injectable } from "@nestjs/common";
import { IUserFactory } from '../interfaces/userFactory.interface';
import { RequestRegisterUserDTO } from "../dto";
import { User } from "../models/user.entity";




@Injectable()
export class UserFactoryService implements IUserFactory {
    DTOCreateToEntityUser(payload: RequestRegisterUserDTO): User {
        const { nombre, apellido, email, password, enable } = payload;

        const user: User = new User();
        user.nombre = nombre;
        user.apellido = apellido;
        user.email = email;
        user.password = password;
        user.enable = enable;

        return user;
    }

}