import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { JwtStrategy } from '../../shared/services/jwtStrategy.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [ConfigModule.forRoot(),
  JwtModule.registerAsync({
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => ({
      secret: configService.get('JWT_SECRET_KEY'),
      //secretOrPrivateKey: 
      signOptions: {
        expiresIn: parseInt(configService.get('JWT_EXPIRESION_KEY')),
      },
    }),
    inject: [ConfigService],
  }),
  ],
  controllers: [UserController],
  providers: [
    {
      provide: 'USER_TRANSPORT',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            host: configService.get('AUTH_HOST'),
            port: configService.get('AUTH_PORT'),
          },
        }),
    },
    // {
    //   provide: 'USER_TRANSPORT',
    //   inject: [ConfigService],
    //   useFactory: (configService: ConfigService) =>
    //     ClientProxyFactory.create({
    //       transport: Transport.NATS,
    //       options: {
    //         servers: [
    //           `nats://${configService.get('NATS_HOST')}:${configService.get(
    //             'NATS_PORT',
    //           )}`,
    //         ],
    //       },
    //     }),
    // },
    JwtStrategy,
  ]

})
export class UserModule { }
