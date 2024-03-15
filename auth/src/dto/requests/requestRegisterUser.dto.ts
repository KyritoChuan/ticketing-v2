import { IsNotEmpty, IsString, IsEmail, IsBoolean } from "class-validator";

export class RequestRegisterUserDTO {
    @IsNotEmpty()
    @IsString()
    readonly nombre: string;

    @IsNotEmpty()
    @IsString()
    readonly apellido: string;

    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    //@IsStrongPassword()
    @IsNotEmpty()
    @IsString()
    readonly password: string;

    @IsNotEmpty()
    @IsBoolean()
    readonly enable: boolean;
}