import { IsNotEmpty, IsNumber, IsString } from "class-validator";


export class RequestCreateTicketDTO {
    @IsNotEmpty()
    @IsString()
    readonly title: string;

    @IsNotEmpty()
    @IsNumber()
    readonly price: number;
}