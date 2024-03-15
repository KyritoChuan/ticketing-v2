import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Order } from './models/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderStatus } from '@kyrito/commons-ticketing/build/types/order-status';
import { stripe } from './utils/stripe';
import { IResponseFactory, RESPONSE_FACTORY_SERVICE } from './shared/interfaces/responseFactory.interface';
import { Payment } from './models/payment.entity';
import { PaymentCreatedPublisher } from './events/payment-created.publisher';
import { RequestCreatePaymentDTO } from './dto';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @Inject(RESPONSE_FACTORY_SERVICE)
    private readonly responseFactoryService: IResponseFactory,
    private readonly paymentCreatedPublisher: PaymentCreatedPublisher,
  ) { }


  async createPayment(data: RequestCreatePaymentDTO) {
    const { chargeToken, orderId, userId } = data;

    const order = await this.orderRepository.findOne({
      where: {
        order_id: orderId,
      }
    });

    if (!order) {
      return this.responseFactoryService.ToResponseDTO(
        HttpStatus.NOT_FOUND, 'Order not found', null
      );
    }

    if (order.user_id !== userId) {
      return this.responseFactoryService.ToResponseDTO(
        HttpStatus.UNAUTHORIZED, 'User not authorizated', null
      );
    }

    if (order.status === OrderStatus.Cancelled) {
      return this.responseFactoryService.ToResponseDTO(
        HttpStatus.BAD_REQUEST, 'Cannot pay for an cancelled order', null
      );
    }

    const charge = await stripe.charges.create({
      currency: 'clp',
      amount: order.price,
      source: chargeToken,
    });

    const payment = new Payment();
    payment.chargeCode = charge.id;

    const paymentResponse = await this.paymentRepository.save(payment);

    this.paymentCreatedPublisher.publishMessage({
      id: paymentResponse.payment_id,
      orderId: order.order_id,
      stripeId: paymentResponse.chargeCode,
    });

    return this.responseFactoryService.ToResponseDTO(
      HttpStatus.OK, "Payment created", paymentResponse
    );
  }
}
