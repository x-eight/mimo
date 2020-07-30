import { IsNotEmpty, IsString } from "class-validator";
import { Schema } from "mongoose";

export class NewProgress {
    @IsNotEmpty()
    userId: Schema.Types.ObjectId;

    @IsNotEmpty()
    courseId: Schema.Types.ObjectId;
    
    chapter: any;
}