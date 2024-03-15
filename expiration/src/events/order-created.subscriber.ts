import { Exchanges, Subscriber, OrderCreatedEvent, Bindings } from "@kyrito/commons-ticketing";
import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { Channel, Connection, ConsumeMessage } from "amqplib";
import { expirationQueue } from "../queues/expiration.queue";


@Injectable()
export class OrderCreatedSubscriber extends Subscriber<OrderCreatedEvent> implements OnModuleInit {
    exchange = Exchanges.OrderCreated;
    binding = Bindings.Fanout;
    routingKey = ""; //routingKey = "order:created_key";
    queueGroupName = "expiration:order-created-queue";
    durable = true;

    constructor(
        @Inject("CONNECTION_RABBITMQ")
        readonly connection: Connection,
    ) {
        super(connection);
    }

    onModuleInit() {
        this.initializeChannel();
    }

    onMessage(data: OrderCreatedEvent['payload'], channel: Channel, message: ConsumeMessage): void {
        const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
        console.log('Waiting this many milliseconds to process the job:', delay);
        console.log("TEst");
        expirationQueue.add({ orderId: data.id }, { delay: 10000 });
        channel.ack(message);
    }
}