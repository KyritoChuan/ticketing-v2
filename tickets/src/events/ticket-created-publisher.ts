import { Bindings, Publisher } from "@kyrito/commons-ticketing";
import { TicketCreatedEvent } from "@kyrito/commons-ticketing";
import { Inject, Injectable } from "@nestjs/common";
import { Exchanges } from "@kyrito/commons-ticketing";
import { Connection } from "amqplib";

@Injectable()
export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    exchange: Exchanges.TicketCreated = Exchanges.TicketCreated;
    binding: Bindings.Fanout = Bindings.Fanout;
    routingKey = ""; //'ticket:created_key';
    durable = true;

    constructor(
        @Inject("CONNECTION_RABBITMQ")
        readonly connection: Connection) {
        super(connection);
    }
}



