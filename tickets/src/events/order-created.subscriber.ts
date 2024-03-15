import { Bindings, Exchanges, OrderCreatedEvent, Subscriber } from "@kyrito/commons-ticketing";
import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Channel, ConsumeMessage, Connection } from "amqplib";
import { Ticket } from "../models/ticket.entity";
import { Repository } from "typeorm";
import { TicketUpdatedPublisher } from "./ticket-updated-publisher";


@Injectable()
export class OrderCreatedSubscriber extends Subscriber<OrderCreatedEvent> implements OnModuleInit {
    exchange = Exchanges.OrderCreated;
    binding = Bindings.Fanout;
    routingKey = "";//routingKey = "order:created_key";
    queueGroupName = "ticket:order-created-queue";
    durable = true;

    constructor(
        @InjectRepository(Ticket)
        private readonly ticketRepository: Repository<Ticket>,
        @Inject("CONNECTION_RABBITMQ")
        readonly connection: Connection,
        private readonly ticketUpdatedPublisher: TicketUpdatedPublisher,
    ) {
        super(connection);
    }
    onModuleInit() {
        this.initializeChannel();
    }

    async onMessage(data: OrderCreatedEvent['payload'], channel: Channel, message: ConsumeMessage): Promise<void> {
        try {
            const ticket = await this.ticketRepository.findOne({
                where: { ticket_id: data.ticket.id }
            });

            if (!ticket) {
                throw new Error('Ticket not found');
            }

            ticket.order_id = data.id;

            const ticketResponse = await this.ticketRepository.save(ticket);

            await this.ticketUpdatedPublisher.publishMessage({
                id: ticketResponse.ticket_id,
                price: ticketResponse.price,
                title: ticketResponse.title,
                userId: ticketResponse.user_id,
                version: ticketResponse.version,
                orderId: ticketResponse.order_id,
            });

            channel.ack(message);

        } catch (error) {
            console.log(error);
            throw new Error("Error en el procesamiento de la cola rabbit: order-created");
        }
    }
}