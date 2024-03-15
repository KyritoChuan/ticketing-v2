import { Body, Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';


@Controller('orders')
export class AppController {
  constructor(private readonly appService: AppService,
  ) { }

  @MessagePattern({ cmd: 'ms-order-show-by-user' })
  async listOfOrdersByUser(currentUser: number) {
    return this.appService.listOfOrdersByUser(currentUser);
  }

  @MessagePattern({ cmd: 'ms-order-find-one' })
  async listOrderById(orderId: number) {
    return this.appService.listOrderById(orderId);
  }

  @MessagePattern({ cmd: 'ms-order-create' })
  async createOrder(@Body() payload: any) {
    return this.appService.createOrder(payload);
  }
}
