import { RequestCreateTicketDTO, RequestUpdateTicketDTO } from '../dto';
import { Ticket } from '../models/ticket.entity';

//   interface and provide that token when injecting to an interface type.
export const TICKET_FACTORY_SERVICE = 'TICKET_FACTORY_SERVICE';


export interface ITicketFactory {
    DTOCreateToEntityTicket(payload: RequestCreateTicketDTO): Ticket;
    DTOUpdateToEntityTicket(payload: RequestUpdateTicketDTO, existingTicket: Ticket): Ticket;
}