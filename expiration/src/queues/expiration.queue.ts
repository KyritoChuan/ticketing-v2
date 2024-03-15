import Queue, { Job } from 'bull';
import { ExpirationCompletePublisher } from '../events/expiration-complete.publisher';
import { rabbitWrapper } from '../shared/rabbit-wrapper';
import { Connection } from 'amqplib';

interface Payload {
    orderId: number;
}

const expirationQueue = new Queue<Payload>('order:expiration', {
    redis: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        //password: process.env.REDIS_PASSWORD,
    },
});

expirationQueue.process(async (job: Job<Payload>) => {
    const { data } = job;

    console.log(process.env.RABBIT_USERNAME)

    const connection: Connection = rabbitWrapper.client;

    new ExpirationCompletePublisher(connection).publishMessage({
        orderId: data.orderId,
    });
});

export { expirationQueue };
