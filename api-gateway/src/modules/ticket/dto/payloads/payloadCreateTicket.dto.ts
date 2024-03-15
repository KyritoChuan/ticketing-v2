import { IsNotEmpty, IsNumber, IsString } from "class-validator";


export class PayloadCreateTicketDTO {
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