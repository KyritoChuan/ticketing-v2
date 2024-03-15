import { Bindings, Publisher } from "@kyrito/commons-ticketing";
import { OrderCreatedEvent } from "@kyrito/commons-ticketing";
import { Inject, Injectable } from "@nestjs/common";
import { Exchanges } from "@kyrito/commons-ticketing";
import { Connection } from "amqplib";

@Injectable()
export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    exchange: Exchanges.OrderCreated = Exchanges.OrderCreated;
    binding: Bindings.Fanout = Bindings.Fanout;
    routingKey = ""; //'order:created_key';
    durable = true;

    constructor(
        @Inject("CONNECTION_RABBITMQ")
        readonly connection: Connection) {
        super(connection);
    }
}
