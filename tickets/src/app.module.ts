import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Ticket } from './models/ticket.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResponseFactoryService } from './shared/services/responseFactory.service';
import { RESPONSE_FACTORY_SERVICE } from './shared/interfaces/responseFactory.interface';
import { TICKET_FACTORY_SERVICE } from './interfaces/ticketFactory.interface';
import { TicketFactoryService } from './services/ticketFactory.service';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';
import { TicketUpdatedPublisher } from './events/ticket-updated-publisher';
import { OrderCreatedSubscriber } from './events/order-created.subscriber';
import { OrderCancelledSubscriber } from './events/order-cancelled.subscriber';
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
        entities: [Ticket],
        synchronize: configService.get('DB_SYNC').toLowerCase() === 'true',
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Ticket]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      useClass: ResponseFactoryService,
      provide: RESPONSE_FACTORY_SERVICE,
    },
    {
      useClass: TicketFactoryService,
      provide: TICKET_FACTORY_SERVICE,
    },
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
    TicketCreatedPublisher,
    TicketUpdatedPublisher,
    OrderCreatedSubscriber,
    OrderCancelledSubscriber,
  ],
})
export class AppModule { }
