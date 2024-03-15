import { IsNotEmpty, IsNumber, IsString } from "class-validator";


export class RequestCreatePaymentDTO {
    @IsNotEmpty()
    @IsNumber()
    readonly orderId: number;

    @IsNotEmpty()
    @IsString()
    readonly chargeToken: string;
}