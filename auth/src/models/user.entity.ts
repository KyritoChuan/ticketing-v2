import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("user")
export class User {
    @PrimaryGeneratedColumn({
        name: "user_id",
    })
    user_id: number;

    @Column({
        nullable: true,
        name: "nombre",
    })
    nombre: string;

    @Column({
        nullable: true,
        name: "apellido",
    })
    apellido: string;

    @Column({
        nullable: true,
        name: "email",
    })
    email: string;

    @Column({
        nullable: true,
        name: "password",
    })
    password: string;

    @Column({
        nullable: true,
        name: "enable",
    })
    enable: boolean;
}