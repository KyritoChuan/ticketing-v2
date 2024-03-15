import { Bindings } from "../interfaces/bindings";
import { Evento } from "../interfaces/event-generic";
import { Exchanges } from "../interfaces/exchanges";


export class ExpirationCompleteEvent implements Evento {
    exchange: Exchanges.ExpirationComplete;
    binding: Bindings.Fanout;
    routingKey: string;
    durable: boolean;
    payload: {
        orderId: number;
    };
}