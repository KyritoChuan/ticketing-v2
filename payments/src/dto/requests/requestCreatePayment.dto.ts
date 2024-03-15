import { IsNotEmpty, IsString, IsNumber } from "class-validator";

export class RequestCreatePaymentDTO {
    @IsNotEmpty()
    @IsNumber()
    readonly orderId: number;

    @IsNotEmpty()
    @IsString()
    readonly chargeToken: string;

    @IsNotEmpty()
    @IsNumber()
    readonly userId: number;
}