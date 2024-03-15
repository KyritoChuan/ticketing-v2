import { Bindings } from "../interfaces/bindings";
import { Evento } from "../interfaces/event-generic";
import { Exchanges } from "../interfaces/exchanges";


export class OrderCancelledEvent implements Evento {
    exchange: Exchanges.OrderCancelled;
    binding: Bindings.Fanout;
    routingKey: string;
    durable: boolean;
    payload: {
        id: number;
        version: number;
        ticket: {
            id: number;
        };
    };
}
