import { Bindings, ConnectionRabbit, Exchanges, OrderCancelledEvent, Publisher } from "@kyrito/commons-ticketing";
import { Inject, Injectable } from "@nestjs/common";
import { Connection } from "amqplib";




@Injectable()
export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    exchange: Exchanges.OrderCancelled = Exchanges.OrderCancelled;
    binding: Bindings.Fanout = Bindings.Fanout;
    routingKey = ""; //'order:created_key';
    durable = true;

    constructor(
        @Inject("CONNECTION_RABBITMQ")
        readonly connection: Connection) {
        super(connection);
    }
}