import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Ticket } from './models/ticket.entity';
import { Order } from './models/order.entity';
import { TicketCreatedSubscriber } from './events/ticket-created-subscriber';
import { TicketUpdatedSubscriber } from './events/ticket-updated-subscriber';
import { ResponseFactoryService } from './shared/services/responseFactory.service';
import { RESPONSE_FACTORY_SERVICE } from './shared/interfaces/responseFactory.interface';
import { OrderCreatedPublisher } from './events/order-created.publisher';
import { ExpirationCompleteSubscriber } from './events/expiration-complete.subscriber';
import { OrderCancelledPublisher } from './events/order-cancelled.publisher';
import { PaymentCreatedSubscriber } from './events/payment-created.subscriber';
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
        entities: [Ticket, Order],
        synchronize: configService.get('DB_SYNC').toLowerCase() === 'true',
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Ticket, Order]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    OrderCreatedPublisher,
    OrderCancelledPublisher,
    TicketCreatedSubscriber,
    TicketUpdatedSubscriber,
    ExpirationCompleteSubscriber,
    PaymentCreatedSubscriber,
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


