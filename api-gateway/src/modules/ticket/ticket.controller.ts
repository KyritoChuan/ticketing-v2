import { Body, Controller, Get, Inject, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { JwtAuthGuard } from '../../shared/guards/jwtAuth.guard';
import { PayloadCreateTicketDTO, PayloadUpdateTicketDTO, RequestCreateTicketDTO, RequestUpdateTicketDTO } from './dto';
import { Request } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { timeout } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@ApiTags("Ticketing maintainers")
@Controller('api/ticket')
export class TicketController {
    constructor(
        @Inject('TICKET_TRANSPORT')
        private readonly ticketClient: ClientProxy,
        private readonly configService: ConfigService,
    ) { }

    @UseGuards(JwtAuthGuard)
    @Post('/create')
    createTicket(@Req() req: Request, @Body() payload: RequestCreateTicketDTO) {
        const { id } = req["user"];

        return this.ticketClient.send<PayloadCreateTicketDTO>({ cmd: 'ms-ticket-create' }, {
            title: payload.title,
            price: payload.price,
            userId: id,
        }).pipe(timeout(Number(this.configService.get('TCP_RESPONSE_TIMEOUT'))));
    }

    @UseGuards(JwtAuthGuard)
    @Get('listAll')
    listAllTickets() {
        return this.ticketClient.send({ cmd: 'ms-ticket-show-all' }, '')
            .pipe(timeout(Number(this.configService.get('TCP_RESPONSE_TIMEOUT'))));
    }

    @UseGuards(JwtAuthGuard)
    @Get('findOne/:id')
    findOneTicket(@Param('id') id: number) {
        return this.ticketClient.send({ cmd: 'ms-ticket-find-one' }, id)
            .pipe(timeout(Number(this.configService.get('TCP_RESPONSE_TIMEOUT'))));
    }

    @UseGuards(JwtAuthGuard)
    @Put('update')
    updateTicket(@Req() req: Request, @Body() payload: RequestUpdateTicketDTO) {
        const { id: userId } = req["user"];

        return this.ticketClient.send<PayloadUpdateTicketDTO>({ cmd: 'ms-ticket-update' }, {
            id: payload.id,
            title: payload.title,
            price: payload.price,
            userId: userId
        }).pipe(timeout(Number(this.configService.get('TCP_RESPONSE_TIMEOUT'))));
    }
}