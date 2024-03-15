import { Bindings, Exchanges, ExpirationCompleteEvent, Subscriber } from "@kyrito/commons-ticketing";
import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { Channel, Connection, ConsumeMessage } from "amqplib";
import { Order } from '../models/order.entity';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { OrderStatus } from "../enums/order-status";
import { OrderCancelledPublisher } from './order-cancelled.publisher';


@Injectable()
export class ExpirationCompleteSubscriber extends Subscriber<ExpirationCompleteEvent> implements OnModuleInit {
    exchange = Exchanges.ExpirationComplete;
    binding = Bindings.Fanout;
    routingKey = "";
    queueGroupName = "order:expiration-complete-queue";
    durable = true;

    constructor(
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
        @Inject("CONNECTION_RABBITMQ")
        readonly connection: Connection,
        private readonly orderCancelledPublisher: OrderCancelledPublisher,
    ) {
        super(connection);
    }

    onModuleInit() {
        this.initializeChannel();
    }

    async onMessage(data: ExpirationCompleteEvent['payload'], channel: Channel, message: ConsumeMessage) {
        console.log("llega a orden: expiration-complete.");
        const order = await this.orderRepository.findOne({
            where: { order_id: data.orderId },
            relations: { ticket: true }
        });

        if (!order) {
            throw new Error("Order not found");
        }

        if (order.status === OrderStatus.Complete) {
            return channel.ack(message);
        }

        order.status = OrderStatus.Cancelled;

        const orderResponse = await this.orderRepository.save(order);

        let ticketId = 0;
        if (orderResponse !== null && orderResponse.ticket.length > 0) {
            ticketId = orderResponse.ticket[0].ticket_id;
        }

        await this.orderCancelledPublisher.publishMessage({
            id: orderResponse.order_id,
            version: orderResponse.version,
            ticket: {
                id: ticketId,
            }
        });

        channel.ack(message);
    }


}