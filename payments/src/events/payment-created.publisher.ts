import { Bindings, Exchanges, PaymentCreatedEvent, Publisher } from "@kyrito/commons-ticketing";
import { Inject, Injectable } from "@nestjs/common";
import { Connection } from "amqplib";


@Injectable()
export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    exchange: Exchanges.PaymentCreated = Exchanges.PaymentCreated;
    binding: Bindings.Fanout = Bindings.Fanout;
    routingKey = "";
    durable = true;

    constructor(
        @Inject("CONNECTION_RABBITMQ")
        readonly connection: Connection) {
        super(connection);
    }
}
