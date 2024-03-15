import { Column, Entity, PrimaryGeneratedColumn, VersionColumn } from "typeorm";

@Entity("ticket")
export class Ticket {
    @PrimaryGeneratedColumn({
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

    @Column({
        nullable: false,
        name: "user_id",
    })
    user_id: number;

    @Column({
        nullable: true,
        name: "order_id",
    })
    order_id?: number;

    @VersionColumn()
    version: number;
}