import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn, VersionColumn } from "typeorm";
import { Ticket } from "./ticket.entity";
import { OrderStatus } from "src/enums/order-status";


@Entity("order")
export class Order {
    @PrimaryGeneratedColumn({
        name: "order_id",
    })
    order_id: number;

    @Column({
        type: "enum",
        enum: OrderStatus,
        default: OrderStatus.Created,
    })
    status: OrderStatus

    @Column({
        nullable: false,
        name: "expiresAt",
    })
    expiresAt: Date;

    @OneToMany(() => Ticket, (ticket) => ticket.order)
    ticket: Ticket[];

    @Column({
        name: "user_id",
        nullable: false,
    })
    user_id: number;

    @VersionColumn()
    version: number;
}