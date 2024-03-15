import { ConnectionRabbit } from "@kyrito/commons-ticketing";
import { Channel, Connection } from "amqplib";
import * as amqp from 'amqplib';

class RabbitWrapper {
    private _client?: Connection;

    get client() {
        if (!this._client) {
            throw new Error('Cannot access RABBITMQ client before connecting.');
        }

        return this._client;
    }

    async connect(connectionInfo: ConnectionRabbit) {
        const { host, port, username, password } = connectionInfo;
        const url = `amqp://${username}:${password}@${host}:${port}`;

        this._client = await amqp.connect(url);

        this._client.on('connect', () => {
            console.log('Connected to RabbitMQ');
        });
        this._client.on('error', (err) => {
            console.error("Error connection MQ: " + err);
        });
    }
}

export const rabbitWrapper = new RabbitWrapper();