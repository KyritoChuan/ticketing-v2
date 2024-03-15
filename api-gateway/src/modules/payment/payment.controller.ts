import { Body, Controller, Inject, Post, Req, UseGuards } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from '../../shared/guards/jwtAuth.guard';
import { RequestCreatePaymentDTO } from "./dto/requestCreatePayment.dto";
import { PayloadCreatePaymentDTO } from "./dto/payloadCreatePayment.dto";
import { timeout } from "rxjs";
import { ConfigService } from "@nestjs/config";


@ApiTags("Payment maintainers")
@Controller('api/payment')
export class PaymentController {
    constructor(
        @Inject('PAYMENT_TRANSPORT')
        private readonly ticketClient: ClientProxy,
        private readonly configService: ConfigService,
    ) { }

    @UseGuards(JwtAuthGuard)
    @Post('/create')
    createTicket(@Req() req: Request, @Body() payload: RequestCreatePaymentDTO) {
        const { id } = req["user"];

        //token, orderId, userId
        return this.ticketClient.send<PayloadCreatePaymentDTO>({ cmd: 'ms-payment-create' }, {
            orderId: payload.orderId,
            chargeToken: payload.chargeToken,
            userId: id,
        }).pipe(timeout(Number(this.configService.get('TCP_RESPONSE_TIMEOUT'))));
    }
}