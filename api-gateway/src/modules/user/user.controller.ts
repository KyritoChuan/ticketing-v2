import { Body, Controller, HttpStatus, Inject, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ClientProxy } from '@nestjs/microservices';
import { map, timeout } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from '../../shared/services/jwtStrategy.service';
import { RequestLoginUserDTO, RequestRegisterUserDTO } from './dto';
import { Response } from 'express';

@ApiTags("Authentication Users")
@Controller('api/user')
export class UserController {
    constructor(
        @Inject('USER_TRANSPORT') private readonly securityUser: ClientProxy,
        private readonly configService: ConfigService,
        private readonly jwtTokens: JwtStrategy,
    ) { }

    @Post('/register')
    RegisterUser(@Body() payload: RequestRegisterUserDTO) {
        return this.securityUser.send({ cmd: 'ms-auth-register' }, payload)
            .pipe(timeout(Number(this.configService.get('TCP_RESPONSE_TIMEOUT'))));
    }

    @Post('/login')
    loginUser(
        @Body() payload: RequestLoginUserDTO,
        @Res({ passthrough: true }) res: Response,
    ) {
        return this.securityUser.send({ cmd: 'ms-auth-login' }, payload)
            .pipe(map((response) => {
                if (response.statusCode === HttpStatus.OK) {
                    const { user_id, email } = response.payload;
                    const jwt = this.jwtTokens.generateAuth(user_id, email);
                    res.cookie('session', jwt);
                }
                return response;
            }),
            )
            .pipe(timeout(Number(this.configService.get('TCP_RESPONSE_TIMEOUT'))));
    }
}
