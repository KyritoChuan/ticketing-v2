import { IsNotEmpty, IsNumber, IsString } from "class-validator";


export class PayloadUpdateTicketDTO {
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