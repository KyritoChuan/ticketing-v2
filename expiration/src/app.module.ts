import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ExpirationCompletePublisher } from './events/expiration-complete.publisher';
import { OrderCreatedSubscriber } from './events/order-created.subscriber';
import { rabbitWrapper } from './shared/rabbit-wrapper';


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [
    ExpirationCompletePublisher,
    OrderCreatedSubscriber,
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

        // process.on('SIGINT', () => {
        //   console.log("SIGINT: " + rabbitWrapper.client);
        //   rabbitWrapper.client.close();
        // });
        // process.on('SIGTERM', async () => {
        //   await rabbitWrapper.client.close();
        // });

        return rabbitWrapper.client;
      },
      inject: [ConfigService],
    },
  ],
})
export class AppModule { }
