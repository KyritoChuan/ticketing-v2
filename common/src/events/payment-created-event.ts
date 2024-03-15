import { Bindings } from "../interfaces/bindings";
import { Evento } from "../interfaces/event-generic";
import { Exchanges } from "../interfaces/exchanges";


export class PaymentCreatedEvent implements Evento {
    exchange: Exchanges.PaymentCreated;
    binding: Bindings.Fanout;
    routingKey: string;
    durable: boolean;
    payload: {
        id: number;
        orderId: number;
        stripeId: string;
    };
}