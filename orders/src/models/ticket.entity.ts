import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, VersionColumn } from "typeorm";
import { Order } from "./order.entity";

@Entity("ticket")
export class Ticket {
    @PrimaryColumn({
        name: "ticket_id",
    })
    ticket_id: number;

    @Column({
        nullable: false,
        name: "title",
    })
    title: string;

    @Column({
        nullable: false,
        name: "price",
    })
    price: number;

    @ManyToOne(() => Order, (order) => order.ticket)
    @JoinColumn({
        name: 'order_id', referencedColumnName: 'order_id'
    })
    order: Order

    @Column({
        nullable: true,
        name: "order_id",
    })
    order_id: number;

    @VersionColumn()
    version: number;
}