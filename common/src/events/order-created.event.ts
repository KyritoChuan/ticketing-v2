import { Bindings } from "../interfaces/bindings";
import { Evento } from "../interfaces/event-generic";
import { Exchanges } from "../interfaces/exchanges";
import { OrderStatus } from "../types/order-status";

export class OrderCreatedEvent implements Evento {
    exchange: Exchanges.OrderCreated;
    binding: Bindings.Fanout;
    routingKey: string;
    durable: boolean;
    payload: {
        id: number;
        version: number;
        status: OrderStatus;
        userId: number;
        expiresAt: string;
        ticket: {
            id: number;
            price: number;
        };
    };
}