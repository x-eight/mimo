import { IsEmail, IsNotEmpty } from 'class-validator';

export class loginUser {

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;

}