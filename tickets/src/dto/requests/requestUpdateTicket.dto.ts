import { IsNotEmpty, IsString, IsEmail, IsBoolean, IsNumber } from "class-validator";

export class RequestUpdateTicketDTO {
    @IsNotEmpty()
    @IsNumber()
    readonly id: number;

    @IsNotEmpty()
    @IsString()
    readonly title: string;

    @IsNotEmpty()
    @IsNumber()
    readonly price: number;

    @IsNotEmpty()
    @IsNumber()
    readonly userId: number;
}