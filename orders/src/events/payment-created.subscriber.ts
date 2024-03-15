import { Bindings, ConnectionRabbit, Exchanges, PaymentCreatedEvent, Subscriber } from "@kyrito/commons-ticketing";
import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { Channel, Connection, ConsumeMessage } from "amqplib";
import { Order } from '../models/order.entity';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { OrderStatus } from "../enums/order-status";


@Injectable()
export class PaymentCreatedSubscriber extends Subscriber<PaymentCreatedEvent> implements OnModuleInit {
    exchange = Exchanges.PaymentCreated;
    binding = Bindings.Fanout;
    routingKey = "";
    queueGroupName = "order:payment-created-queue";
    durable = true;

    constructor(
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
        @Inject("CONNECTION_RABBITMQ")
        readonly connection: Connection,
    ) {
        super(connection);
    }

    onModuleInit() {
        this.initializeChannel();
    }

    async onMessage(data: PaymentCreatedEvent['payload'], channel: Channel, message: ConsumeMessage) {
        try {
            const order = await this.orderRepository.findOne({
                where: {
                    order_id: data.orderId
                }
            });

            if (!order) {
                throw new Error('Order not found');
            }

            order.status = OrderStatus.Complete;
            const orderResponse = await this.orderRepository.save(order);

            channel.ack(message);
        } catch (error) {
            console.log(error);
            throw new Error("Error en el procesamiento de la cola rabbit: subscriber payment-created");
        }

    }


}