import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

@Module({
    imports: [],
    controllers: [OrderController],
    providers: [
        {
            provide: 'ORDER_TRANSPORT',
            inject: [ConfigService],
            useFactory: (configService: ConfigService) =>
                ClientProxyFactory.create({
                    transport: Transport.TCP,
                    options: {
                        host: configService.get('ORDER_HOST'),
                        port: configService.get('ORDER_PORT'),
                    },
                }),
        },
    ],
})
export class OrderModule { }
