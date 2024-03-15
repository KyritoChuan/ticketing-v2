import { Injectable } from "@nestjs/common";
import { ITicketFactory } from '../interfaces/ticketFactory.interface';
import { RequestCreateTicketDTO, RequestUpdateTicketDTO } from "../dto";
import { Ticket } from "../models/ticket.entity";


@Injectable()
export class TicketFactoryService implements ITicketFactory {
    DTOUpdateToEntityTicket(payload: RequestUpdateTicketDTO, existingTicket: Ticket): Ticket {
        const { price, title, userId } = payload;

        existingTicket.price = price;
        existingTicket.title = title;
        existingTicket.user_id = userId;

        return existingTicket;
    }
    DTOCreateToEntityTicket(payload: RequestCreateTicketDTO): Ticket {
        const { price, title, userId } = payload;

        const ticket = new Ticket();
        ticket.price = price;
        ticket.title = title;
        ticket.user_id = userId;

        return ticket;
    }

}