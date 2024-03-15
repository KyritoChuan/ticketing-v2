import { Bindings, Exchanges, Subscriber, TicketUpdatedEvent } from "@kyrito/commons-ticketing";
import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Channel, Connection, ConsumeMessage } from "amqplib";
import { Ticket } from "src/models/ticket.entity";
import { Repository } from "typeorm";




@Injectable()
export class TicketUpdatedSubscriber extends Subscriber<TicketUpdatedEvent> implements OnModuleInit {
    exchange = Exchanges.TicketUpdated;
    binding = Bindings.Fanout;
    routingKey = ""; // "ticket:updated_key";
    queueGroupName = "order:ticket-updated-queue";
    durable = true;

    constructor(
        @InjectRepository(Ticket)
        private readonly ticketRepository: Repository<Ticket>,
        @Inject("CONNECTION_RABBITMQ")
        readonly connection: Connection,
    ) {
        super(connection);
    }

    onModuleInit() {
        this.initializeChannel();
    }


    async onMessage(data: TicketUpdatedEvent['payload'], channel: Channel, message: ConsumeMessage): Promise<void> {
        try {
            const ticket = await this.ticketRepository.findOne({
                where: {
                    ticket_id: data.id,
                    version: data.version - 1,
                }
            });

            if (ticket === null) {
                throw new Error('Ticket not found');
            }

            ticket.title = data.title;
            ticket.price = data.price;
            ticket.order_id = data.orderId;

            await this.ticketRepository.save(ticket);

            channel.ack(message);
        } catch (error) {
            console.log(error);
            throw new Error("Error en el procesamiento de la cola rabbit: subscriber ticket-updated");
        }
    }
}