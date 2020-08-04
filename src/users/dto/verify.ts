import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginNumber {
    @IsNotEmpty()
    @IsString()
    phone: string;
}

export class VerifyNumber {
    @IsNotEmpty()
    @IsString()
    phone: string;

    @IsNotEmpty()
    @IsString()
    code: string;
}