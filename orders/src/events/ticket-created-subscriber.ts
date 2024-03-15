import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Ticket } from "../models/ticket.entity";
import { Bindings, Subscriber } from "@kyrito/commons-ticketing";
import { TicketCreatedEvent } from "@kyrito/commons-ticketing";
import { Channel, Connection, ConsumeMessage } from "amqplib";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Exchanges } from "@kyrito/commons-ticketing";


@Injectable()
export class TicketCreatedSubscriber extends Subscriber<TicketCreatedEvent> implements OnModuleInit {
    exchange = Exchanges.TicketCreated;
    binding = Bindings.Fanout;
    routingKey = ""; //"ticket:created_key";
    queueGroupName = "order:ticket-created-queue";
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

    async onMessage(data: TicketCreatedEvent['payload'], channel: Channel, message: ConsumeMessage): Promise<void> {
        try {
            const { id, title, price } = data;

            const ticket = new Ticket();
            ticket.ticket_id = id;
            ticket.title = title;
            ticket.price = price;
            ticket.version = data.version; // Problemas con la persistencia, asegurando versiones exactas.

            await this.ticketRepository.save(ticket);

            channel.ack(message);
        } catch (error) {
            console.log(error);
            throw new Error("Error en el procesamiento de la cola rabbit: ticket-created");
        }
    }
}