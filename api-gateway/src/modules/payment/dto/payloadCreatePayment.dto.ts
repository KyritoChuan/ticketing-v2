import { IsNotEmpty, IsNumber, IsString } from "class-validator";


export class PayloadCreatePaymentDTO {
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