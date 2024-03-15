import { Body, Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';
import { RequestCreateTicketDTO } from './dto/requests/requestCreateTicket.dto';
import { ResponseDTO } from './shared/dto/response.dto';
import { Ticket } from './models/ticket.entity';
import { RequestUpdateTicketDTO } from './dto/requests/requestUpdateTicket.dto';


@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
  ) { }

  @MessagePattern({ cmd: 'ms-ticket-create' })
  async createTicket(@Body() payload: RequestCreateTicketDTO): Promise<ResponseDTO<Ticket>> {
    return await this.appService.createTicket(payload);
  }

  @MessagePattern({ cmd: 'ms-ticket-show-all' })
  async getAllTickets(): Promise<ResponseDTO<Ticket[]>> {
    return await this.appService.getAllTickets();
  }

  @MessagePattern({ cmd: 'ms-ticket-find-one' })
  async findOneTicket(id: number): Promise<ResponseDTO<Ticket>> {
    return await this.appService.findOneTicket(id);
  }

  @MessagePattern({ cmd: 'ms-ticket-update' })
  async updateTicket(@Body() payload: RequestUpdateTicketDTO): Promise<ResponseDTO<Ticket>> {
    return await this.appService.updateTicket(payload);
  }
}
