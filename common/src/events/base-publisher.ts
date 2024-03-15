import { Connection } from "amqplib";
import { Evento } from '../interfaces/event-generic';



export abstract class Publisher<T extends Evento> {
    abstract exchange: T['exchange'];
    abstract binding: T['binding'];
    abstract routingKey: T['routingKey'];
    abstract durable: T['durable'];

    protected connection: Connection;

    constructor(connection: Connection) {
        this.connection = connection;
    }

    async publishMessage(data: T['payload']): Promise<void> {
        const channel = await this.connection.createChannel();

        await channel.assertExchange(this.exchange, this.binding, { durable: this.durable });

        console.log(`Sending message to ${this.exchange.toString()} : ${JSON.stringify(data)}`);
        // Publish the message
        channel.publish(this.exchange, this.routingKey, Buffer.from(JSON.stringify(data)));

        setTimeout(() => {
            this.connection.close();
        }, 500);
    }
}