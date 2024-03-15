import { IsNotEmpty, IsNumber, IsString } from "class-validator";

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
}