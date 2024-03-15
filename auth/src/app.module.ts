import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './models/user.entity';
import { EncryptImpl } from './services/encrypt.service';
import { ENCRYPT_SERVICE } from './interfaces/encrypt.interface';
import { ResponseFactoryService } from './shared/services/responseFactory.service';
import { RESPONSE_FACTORY_SERVICE } from './shared/interfaces/responseFactory.interface';
import { UserFactoryService } from './services/userFactory.service';
import { USER_FACTORY_SERVICE } from './interfaces/userFactory.interface';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: parseInt(configService.get('DB_PORT')),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [User],
        synchronize: configService.get('DB_SYNC').toLowerCase() === 'true',
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      useClass: EncryptImpl, // You can switch useClass to different implementation
      provide: ENCRYPT_SERVICE,
    },
    {
      useClass: ResponseFactoryService,
      provide: RESPONSE_FACTORY_SERVICE,
    },
    {
      useClass: UserFactoryService,
      provide: USER_FACTORY_SERVICE,
    }
  ],
})
export class AppModule { }
