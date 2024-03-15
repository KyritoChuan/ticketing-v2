import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './models/user.entity';
import { Repository } from 'typeorm';
import { ResponseDTO } from './shared/dto/response.dto';
import { ENCRYPT_SERVICE, IEncrypt } from './interfaces/encrypt.interface';
import { RequestLoginUserDTO, RequestRegisterUserDTO } from './dto';
import { RESPONSE_FACTORY_SERVICE, IResponseFactory } from './shared/interfaces/responseFactory.interface';
import { IUserFactory, USER_FACTORY_SERVICE } from './interfaces/userFactory.interface';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(ENCRYPT_SERVICE)
    private readonly encryptService: IEncrypt,
    @Inject(RESPONSE_FACTORY_SERVICE)
    private readonly responseFactoryService: IResponseFactory,
    @Inject(USER_FACTORY_SERVICE)
    private readonly userFactoryService: IUserFactory,
  ) { }

  async register(payload: RequestRegisterUserDTO): Promise<ResponseDTO<User>> {
    try {
      const newUser = this.userFactoryService.DTOCreateToEntityUser(payload);

      const existingUser = await this.userRepository.findOneBy({
        email: newUser.email,
      });

      if (existingUser) {
        return this.responseFactoryService.ToResponseDTO(
          HttpStatus.FORBIDDEN, "The user is already registered", null
        );
      }

      newUser.password = await this.encryptService.encryptPassword(newUser.password);

      const userRegisterDB = await this.userRepository.save(
        newUser
      );

      if (userRegisterDB) {
        return this.responseFactoryService.ToResponseDTO(
          HttpStatus.CREATED, "User created", userRegisterDB
        );
      } else {
        return this.responseFactoryService.ToResponseDTO(
          HttpStatus.INTERNAL_SERVER_ERROR, "Failed to register user", null
        );
      }
    } catch (error) {
      if (error.code && error.code === "ER_DUP_ENTRY") {
        return this.responseFactoryService.ToResponseDTO(
          HttpStatus.FOUND, "Inconsistency detected. Security information previously registered for the user", null
        );
      } else {
        return this.responseFactoryService.ToResponseDTO(
          HttpStatus.INTERNAL_SERVER_ERROR, "Failed to register user", null
        );
      }
    }
  }

  async login(login: RequestLoginUserDTO): Promise<ResponseDTO<User>> {
    try {
      const existingUser: User = await this.userRepository.findOneBy({
        email: login.email,
      });

      if (!existingUser) {
        return this.responseFactoryService.ToResponseDTO(
          HttpStatus.NOT_FOUND, "User not exist", null
        );
      }

      const passwordsMatch: boolean = await this.encryptService.comparePassword(login.password, existingUser.password);

      if (passwordsMatch) {
        return this.responseFactoryService.ToResponseDTO(
          HttpStatus.OK, "Authenticated user", existingUser
        );
      } else {
        return this.responseFactoryService.ToResponseDTO(
          HttpStatus.FORBIDDEN, "Invalid user password", null
        );
      }

    } catch (error) {
      return this.responseFactoryService.ToResponseDTO(
        HttpStatus.INTERNAL_SERVER_ERROR, "Failed to login user", null
      );
    }
  }
}
