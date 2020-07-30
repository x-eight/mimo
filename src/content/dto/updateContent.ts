import { IsNotEmpty, IsString } from "class-validator";

export class UpdateContent {
    @IsNotEmpty()
    @IsString()
    name: string;

    slug: string;

    
}