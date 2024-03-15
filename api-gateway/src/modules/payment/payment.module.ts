import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { PaymentController } from './payment.controller';

@Module({
    imports: [],
    controllers: [PaymentController],
    providers: [
        {
            provide: 'PAYMENT_TRANSPORT',
            inject: [ConfigService],
            useFactory: (configService: ConfigService) =>
                ClientProxyFactory.create({
                    transport: Transport.TCP,
                    options: {
                        host: configService.get('PAYMENT_HOST'),
                        port: configService.get('PAYMENT_PORT'),
                    },
                }),
        },
    ],
})
export class PaymentModule { }
