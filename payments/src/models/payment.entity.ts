import { Column, Entity, OneToMany, PrimaryGeneratedColumn, VersionColumn } from "typeorm";
import { Order } from "./order.entity";


@Entity("payment")
export class Payment {
    @PrimaryGeneratedColumn({
        name: "payment_id",
    })
    payment_id: number;

    @OneToMany(() => Order, (order) => order.payment)
    order: Order[];

    @Column({
        name: "payment_code",
        nullable: false,
    })
    chargeCode: string;

    @VersionColumn()
    version: number;
}