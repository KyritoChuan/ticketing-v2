import { Bindings, Exchanges, OrderCancelledEvent, Subscriber } from "@kyrito/commons-ticketing";
import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { TicketUpdatedPublisher } from "./ticket-updated-publisher";
import { Channel, ConsumeMessage, Connection } from "amqplib";
import { InjectRepository } from "@nestjs/typeorm";
import { Ticket } from "../models/ticket.entity";
import { Repository } from "typeorm";


@Injectable()
export class OrderCancelledSubscriber extends Subscriber<OrderCancelledEvent> implements OnModuleInit {
    exchange = Exchanges.OrderCancelled;
    binding = Bindings.Fanout;
    routingKey = "";//routingKey = "order:created_key";
    queueGroupName = "ticket:order-cancelled-queue";
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


    async onMessage(data: OrderCancelledEvent['payload'], channel: Channel, message: ConsumeMessage) {
        try {
            const ticket = await this.ticketRepository.findOne({
                where: {
                    ticket_id: data.ticket.id,
                }
            });

            if (!ticket) {
                throw new Error("Ticket not found");
            }

            ticket.order_id = null;

            const ticketResponse = await this.ticketRepository.save(ticket);

            await this.ticketUpdatedPublisher.publishMessage({
                id: ticketResponse.ticket_id,
                orderId: ticketResponse.order_id,
                userId: ticketResponse.user_id,
                price: ticketResponse.price,
                title: ticketResponse.title,
                version: ticketResponse.version,
            });

            channel.ack(message);
        } catch (error) {
            console.log(error);
            throw new Error("Error en el procesamiento de la cola rabbit: order-cancelled");
        }
    }
}
