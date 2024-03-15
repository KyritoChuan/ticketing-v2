import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller('payments')
export class AppController {
  constructor(private readonly appService: AppService) { }

  @MessagePattern({ cmd: 'ms-payment-create' })
  registerPayment(payload: any) {
    return this.appService.createPayment(payload);
  }
}
