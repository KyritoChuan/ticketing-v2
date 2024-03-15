import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Order } from './models/order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './models/payment.entity';
import { ResponseFactoryService } from './shared/services/responseFactory.service';
import { RESPONSE_FACTORY_SERVICE } from './shared/interfaces/responseFactory.interface';
import { PaymentCreatedPublisher } from './events/payment-created.publisher';
import { rabbitWrapper } from './shared/rabbit-wrapper';

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
        entities: [Order, Payment],
        synchronize: configService.get('DB_SYNC').toLowerCase() === 'true',
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Order, Payment]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PaymentCreatedPublisher,
    {
      provide: 'CONNECTION_RABBITMQ',
      useFactory: async (configService: ConfigService) => {
        await rabbitWrapper.connect({
          host: configService.get('RABBIT_HOST'),
          port: parseInt(configService.get('RABBIT_PORT')),
          username: configService.get('RABBIT_USERNAME'),
          password: configService.get('RABBIT_PASSWORD')
        });

        rabbitWrapper.client.on('close', () => {
          console.log('RabbitMQ connection closed!');
          process.exit();
        });

        // process.on('SIGINT', () => rabbitWrapper.client.close());
        // process.on('SIGTERM', () => rabbitWrapper.client.close());

        return rabbitWrapper.client;
      },
      inject: [ConfigService],
    },
    {
      useClass: ResponseFactoryService,
      provide: RESPONSE_FACTORY_SERVICE,
    },
  ],
})
export class AppModule { }
