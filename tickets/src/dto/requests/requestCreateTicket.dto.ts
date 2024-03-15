import { IsNotEmpty, IsString, IsEmail, IsBoolean, IsNumber } from "class-validator";

export class RequestCreateTicketDTO {
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