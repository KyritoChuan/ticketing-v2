import { Module } from '@nestjs/common';
import { TicketController } from './ticket.controller';
import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

@Module({
    imports: [],
    controllers: [TicketController],
    providers: [
        {
            provide: 'TICKET_TRANSPORT',
            inject: [ConfigService],
            useFactory: (configService: ConfigService) =>
                ClientProxyFactory.create({
                    transport: Transport.TCP,
                    options: {
                        host: configService.get('TICKET_HOST'),
                        port: configService.get('TICKET_PORT'),
                    },
                }),
        },
        // {
        //     provide: 'TICKET_TRANSPORT',
        //     inject: [ConfigService],
        //     useFactory: (configService: ConfigService) => {
        //         const queue_input = configService.get<string>('QUEUE_TICKET_INPUT');
        //         const rabbit_host = configService.get<string>('RABBIT_HOST');
        //         const rabbit_port = parseInt(configService.get<string>('RABBIT_PORT'));
        //         const username = configService.get<string>('RABBIT_USERNAME');
        //         const password = configService.get<string>('RABBIT_PASSWORD');

        //         return ClientProxyFactory.create({
        //             transport: Transport.RMQ,
        //             options: {
        //                 urls: [`amqp://${username}:${password}@${rabbit_host}:${rabbit_port}`],
        //                 queue: `${queue_input}`,
        //                 queueOptions: {
        //                     durable: true, // persistente, en false lo guarda en caché.
        //                 },
        //                 noAck: true, // activación manual de confirmación de mensaje.
        //             },
        //         })
        //     },
        // },
    ],
})
export class TicketModule { }
