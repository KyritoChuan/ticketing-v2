import { Bindings } from "../interfaces/bindings";
import { Evento } from "../interfaces/event-generic";
import { Exchanges } from "../interfaces/exchanges";


export class TicketUpdatedEvent implements Evento {
    exchange: Exchanges.TicketUpdated;
    binding: Bindings.Fanout;
    routingKey: string;
    durable: boolean;
    payload: {
        id: number;
        version: number;
        title: string;
        price: number;
        userId: number;
        orderId?: number;
    };
}