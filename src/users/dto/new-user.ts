import { IsNotEmpty, IsEmail, IsString, MinLength, MaxLength, Matches } from "class-validator";

export class NewUser {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    /*
    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @MaxLength(20)
    @Matches(
        /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
        { message: 'password too weak' },
    )
    password: string;
    */
   @IsNotEmpty()
   @IsString()
   password: string;
}