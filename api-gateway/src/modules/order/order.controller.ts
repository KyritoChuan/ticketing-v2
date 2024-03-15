import { Controller, Get, Inject, Param, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../shared/guards/jwtAuth.guard';
import { ClientProxy } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { timeout } from 'rxjs';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Orders maintainers")
@Controller('api/order')
export class OrderController {
    constructor(
        @Inject('ORDER_TRANSPORT')
        private readonly orderClient: ClientProxy,
        private readonly configService: ConfigService,
    ) { }

    @UseGuards(JwtAuthGuard)
    @Get('listAll')
    listOrderByUser(@Req() req: Request) {
        const { id } = req["user"];

        return this.orderClient.send({ cmd: 'ms-order-show-by-user' }, id)
            .pipe(timeout(Number(this.configService.get('TCP_RESPONSE_TIMEOUT'))));
    }

    @UseGuards(JwtAuthGuard)
    @Get('findOne')
    findOneOrder(@Param('id') id: number) {
        return this.orderClient.send({ cmd: 'ms-order-find-one' }, id)
            .pipe(timeout(Number(this.configService.get('TCP_RESPONSE_TIMEOUT'))));
    }

    @UseGuards(JwtAuthGuard)
    @Post('create/:ticketId')
    CreateOrder(@Req() req: Request, @Param('ticketId') ticketId: number) {
        const { id: userId } = req["user"];

        return this.orderClient.send({ cmd: 'ms-order-create' }, { userId, ticketId })
            .pipe(timeout(Number(this.configService.get('TCP_RESPONSE_TIMEOUT'))));
    }
}
