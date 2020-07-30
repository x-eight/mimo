import { IsNotEmpty, IsString } from "class-validator";
import { Schema } from "mongoose";

export class NewChapter {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    courseId: Schema.Types.ObjectId;

    slug: string;
   
}
