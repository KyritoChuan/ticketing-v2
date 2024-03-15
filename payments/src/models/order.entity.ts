import { OrderStatus } from "@kyrito/commons-ticketing/build/types/order-status";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, VersionColumn } from "typeorm";
import { Payment } from "./payment.entity";

@Entity("order")
export class Order {
    @PrimaryGeneratedColumn({
        name: "order_id",
    })
    order_id: number;

    @ManyToOne(() => Payment, (payment) => payment.order)
    @JoinColumn({
        name: 'payment_id', referencedColumnName: 'payment_id'
    })
    payment: Payment;

    @Column({
        nullable: true,
        name: "payment_id",
    })
    payment_id: number;

    @Column({
        type: "enum",
        enum: OrderStatus,
    })
    status: OrderStatus

    @Column({
        name: "price",
        nullable: false,
    })
    price: number;

    @Column({
        name: "user_id",
        nullable: false,
    })
    user_id: number;

    @VersionColumn()
    version: number;
}