import { Bindings, ConnectionRabbit, Exchanges, ExpirationCompleteEvent, Publisher } from "@kyrito/commons-ticketing";
import { Inject, Injectable } from "@nestjs/common";
import { Connection } from "amqplib";



@Injectable()
export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    exchange: Exchanges.ExpirationComplete = Exchanges.ExpirationComplete;
    binding: Bindings.Fanout = Bindings.Fanout;
    routingKey = "";//'expiration:complete_key';
    durable = true;

    constructor(
        @Inject("CONNECTION_RABBITMQ")
        readonly connection: Connection) {
        super(connection);
    }
}
