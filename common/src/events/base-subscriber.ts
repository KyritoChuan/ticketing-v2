import { Channel, ConsumeMessage, Connection } from "amqplib";
import { Exchanges } from "../interfaces/exchanges";
import { Evento } from "../interfaces/event-generic";
import { Bindings } from "../interfaces/bindings";



export abstract class Subscriber<T extends Evento> {
    protected connection: Connection;

    abstract queueGroupName: string;
    abstract exchange: Exchanges;
    abstract binding: Bindings;
    abstract routingKey: string;
    abstract durable: boolean;
    abstract onMessage(data: T['payload'], channel: Channel, message: ConsumeMessage): void;

    constructor(connection: Connection) {
        this.connection = connection;
    }

    async initializeChannel() {
        const channel = await this.connection.createChannel();

        await channel.assertExchange(this.exchange, this.binding, { durable: this.durable });

        const queue = await channel.assertQueue(this.queueGroupName, { exclusive: false });

        await channel.bindQueue(queue.queue, this.exchange, this.routingKey);

        channel.consume(
            queue.queue,
            (msg: ConsumeMessage | null) => {
                if (msg !== null) {
                    console.log(`Subscription Arrived ${this.exchange.toString()} :`);
                    const data = JSON.parse(msg.content.toString());
                    console.log(data);
                    this.onMessage(data, channel, msg);
                }

            },
            { noAck: false },
        );
    }
}