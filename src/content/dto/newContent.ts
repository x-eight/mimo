import { IsNotEmpty, IsString } from "class-validator";
import { Schema } from "mongoose";

export class NewContent {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    chapterId: Schema.Types.ObjectId;

    video: string;

    file: string;

    slug: string;

    
}