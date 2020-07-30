import { IsNotEmpty, IsString } from "class-validator";

export class NewCourse {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    tema: string;

    @IsNotEmpty()
    @IsString()
    language: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    slug: string;

    
}
