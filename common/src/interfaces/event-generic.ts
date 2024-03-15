import { Bindings } from "./bindings";
import { Exchanges } from "./exchanges";


export interface Evento {
    exchange: Exchanges,
    binding: Bindings,
    routingKey: string,
    durable: boolean,
    payload: any,
}