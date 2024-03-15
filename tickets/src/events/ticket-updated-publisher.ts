import { Bindings, ConnectionRabbit, Exchanges, Publisher, TicketUpdatedEvent } from "@kyrito/commons-ticketing";
import { Inject, Injectable } from "@nestjs/common";
import { Connection } from "amqplib";


@Injectable()
export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    exchange: Exchanges.TicketUpdated = Exchanges.TicketUpdated;
    binding: Bindings.Fanout = Bindings.Fanout;
    routingKey = ""; //'ticket:updated_key';
    durable = true;

    constructor(
        @Inject("CONNECTION_RABBITMQ")
        readonly connection: Connection) {
        super(connection);
    }
}

