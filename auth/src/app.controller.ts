import { Controller, Get, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';
import { RequestRegisterUserDTO, RequestLoginUserDTO } from './dto';
import { ResponseDTO } from './shared/dto/response.dto';
import { User } from './models/user.entity';
import { Request } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }


  @MessagePattern({ cmd: 'ms-auth-register' })
  async register(payload: RequestRegisterUserDTO): Promise<ResponseDTO<User>> {
    console.log(payload);
    return await this.appService.register(payload);
  }

  @MessagePattern({ cmd: 'ms-auth-login' })
  async login(payload: RequestLoginUserDTO): Promise<ResponseDTO<User>> {
    console.log(payload);
    return await this.appService.login(payload);
  }

  @MessagePattern({ cmd: 'ms-auth-currentUser' })
  async getCurrentUser(@Req() request: Request, payload: any) {//(registerUserDto: RqRegisterUserDto) {
    console.log(request);
    return "ciao mundo TESting";
  }
}
