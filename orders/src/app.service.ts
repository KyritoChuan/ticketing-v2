import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './models/order.entity';
import { IResponseFactory, RESPONSE_FACTORY_SERVICE } from './shared/interfaces/responseFactory.interface';
import { ResponseDTO } from './shared/dto/response.dto';
import { Ticket } from './models/ticket.entity';
import { OrderStatus } from './enums/order-status';
import { OrderCreatedPublisher } from './events/order-created.publisher';

const EXPIRATION_WINDOW_SECONDS = 1 * 60;

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @Inject(RESPONSE_FACTORY_SERVICE)
    private readonly responseFactoryService: IResponseFactory,
    private readonly orderCreatedPublisher: OrderCreatedPublisher,
    // @Inject(TICKET_FACTORY_SERVICE)
    // private readonly ticketFactoryService: ITicketFactory,
  ) { }

  async listOfOrdersByUser(currentUser: number): Promise<ResponseDTO<Order[]>> {
    try {
      const orders = await this.orderRepository.find({
        where: {
          user_id: currentUser
        },
        relations: { ticket: true }
      });

      return this.responseFactoryService.ToResponseDTO(
        HttpStatus.OK, "List of orders by user finded", orders
      );

    } catch (error) {
      return this.responseFactoryService.ToResponseDTO(
        HttpStatus.INTERNAL_SERVER_ERROR, "Failed to getting orders by user", null
      );
    }
  }

  async listOrderById(orderId: number) {
    try {
      const orderFinded = await this.orderRepository.findOne({
        where: {
          order_id: orderId
        },
        relations: { ticket: true }
      });

      if (!orderFinded) {
        return this.responseFactoryService.ToResponseDTO(
          HttpStatus.NOT_FOUND, '', null
        );
      }

      if (orderFinded.user_id !== orderId) {
        return this.responseFactoryService.ToResponseDTO(
          HttpStatus.UNAUTHORIZED, '', null
        );
      }

      return this.responseFactoryService.ToResponseDTO(
        HttpStatus.OK, "Order by id finded", orderFinded
      );

    } catch (error) {
      return this.responseFactoryService.ToResponseDTO(
        HttpStatus.INTERNAL_SERVER_ERROR, "Failed to getting order by id", null
      );
    }
  }

  async createOrder(payload: any): Promise<ResponseDTO<Order>> {
    try {
      const { userId, ticketId } = payload;

      const ticket = await this.ticketRepository.findOne({ where: { ticket_id: ticketId } });

      if (!ticket) {
        return this.responseFactoryService.ToResponseDTO(
          HttpStatus.NOT_FOUND, "Ticket to reserved not found", null
        );
      }

      const isReserved = await this.orderRepository.findOne({
        where: {
          status: OrderStatus.Created || OrderStatus.AwaitingPayment || OrderStatus.Complete,
          ticket: ticket,
        }
      });

      if (isReserved) {
        return this.responseFactoryService.ToResponseDTO(
          HttpStatus.BAD_REQUEST, "Ticket is already reserved", null
        );
      }

      const expiration = new Date();
      expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);


      const order = new Order();
      order.user_id = userId;
      order.status = OrderStatus.Created;
      order.expiresAt = expiration;
      //order.ticket = [ticket];

      console.log("antes de guardar la orden: " + JSON.stringify(order));

      const orderResponse = await this.orderRepository.save(order);

      console.log("despues de guardar la orden: " + JSON.stringify(orderResponse));
      await this.orderCreatedPublisher.publishMessage({
        id: orderResponse.order_id,
        status: orderResponse.status,
        expiresAt: orderResponse.expiresAt.toISOString(),
        version: orderResponse.version,
        userId: orderResponse.user_id,
        ticket: {
          id: ticket.ticket_id,
          price: ticket.price
        }
      });

      return this.responseFactoryService.ToResponseDTO(
        HttpStatus.OK, "Order created", orderResponse
      );

    } catch (error) {
      console.log(error);
      return this.responseFactoryService.ToResponseDTO(
        HttpStatus.INTERNAL_SERVER_ERROR, "Failed to create order", null
      );
    }
  }


}
