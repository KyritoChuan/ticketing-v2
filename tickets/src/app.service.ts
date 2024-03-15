import { RESPONSE_FACTORY_SERVICE, IResponseFactory } from './shared/interfaces/responseFactory.interface';
import { TICKET_FACTORY_SERVICE, ITicketFactory } from './interfaces/ticketFactory.interface';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './models/ticket.entity';
import { RequestCreateTicketDTO, RequestUpdateTicketDTO } from './dto';
import { ResponseDTO } from './shared/dto/response.dto';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';
import { TicketUpdatedPublisher } from './events/ticket-updated-publisher';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @Inject(RESPONSE_FACTORY_SERVICE)
    private readonly responseFactoryService: IResponseFactory,
    @Inject(TICKET_FACTORY_SERVICE)
    private readonly ticketFactoryService: ITicketFactory,
    private readonly ticketCreatedPublisher: TicketCreatedPublisher,
    private readonly ticketUpdatedPublisher: TicketUpdatedPublisher,
  ) { }

  async createTicket(payload: RequestCreateTicketDTO): Promise<ResponseDTO<Ticket>> {
    try {
      const ticket = this.ticketFactoryService.DTOCreateToEntityTicket(payload);

      const ticketResponse = await this.ticketRepository.save(ticket);

      console.log('event ticket-created mandado');

      await this.ticketCreatedPublisher.publishMessage({
        id: ticketResponse.ticket_id,
        price: ticketResponse.price,
        title: ticketResponse.title,
        userId: ticketResponse.user_id,
        version: ticketResponse.version,
      });

      return this.responseFactoryService.ToResponseDTO(HttpStatus.CREATED, "Ticket created", ticketResponse);

    } catch (error) {
      console.log(error);
      return this.responseFactoryService.ToResponseDTO(
        HttpStatus.INTERNAL_SERVER_ERROR, "Failed to register ticket", null
      );
    }
  }

  async updateTicket(payload: RequestUpdateTicketDTO): Promise<ResponseDTO<Ticket>> {
    try {
      const findedTicket = await this.ticketRepository.findOneBy({ ticket_id: payload.id });

      if (findedTicket === null) {
        return this.responseFactoryService.ToResponseDTO(HttpStatus.NOT_FOUND, "Ticket not found", null);
      }

      const ticketToUpdate = this.ticketFactoryService.DTOUpdateToEntityTicket(payload, findedTicket);

      const ticketResponse = await this.ticketRepository.save(ticketToUpdate);

      await this.ticketUpdatedPublisher.publishMessage({
        id: ticketResponse.ticket_id,
        price: ticketResponse.price,
        title: ticketResponse.title,
        version: ticketResponse.version,
        userId: ticketResponse.user_id,
      });

      return this.responseFactoryService.ToResponseDTO(HttpStatus.OK, "Ticket updated", ticketResponse);

    } catch (error) {
      return this.responseFactoryService.ToResponseDTO(
        HttpStatus.INTERNAL_SERVER_ERROR, "Failed to update ticket", null
      );
    }
  }

  async getAllTickets(): Promise<ResponseDTO<Ticket[]>> {
    try {
      const listOfTickets = await this.ticketRepository.find({
        where: { order_id: undefined },
      });

      return this.responseFactoryService.ToResponseDTO(
        HttpStatus.OK, "List of tickets finded", listOfTickets
      );

    } catch (error) {
      return this.responseFactoryService.ToResponseDTO(
        HttpStatus.INTERNAL_SERVER_ERROR, "Failed to getting tickets", null
      );
    }
  }

  async findOneTicket(id: number): Promise<ResponseDTO<Ticket>> {
    try {
      const ticket = await this.ticketRepository.findOne({
        where: {
          ticket_id: id,
        }
      });

      if (ticket !== null) {
        return this.responseFactoryService.ToResponseDTO(
          HttpStatus.OK, "Ticket finded", ticket
        );
      } else {
        return this.responseFactoryService.ToResponseDTO(
          HttpStatus.NOT_FOUND, "Ticket not found", null
        );
      }
    } catch (error) {
      return this.responseFactoryService.ToResponseDTO(
        HttpStatus.INTERNAL_SERVER_ERROR, "Failed to getting ticket", null
      );
    }
  }

}
