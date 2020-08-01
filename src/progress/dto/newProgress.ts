import { IsNotEmpty, IsString } from "class-validator";
import { Schema } from "mongoose";

export class NewProgress {
    @IsNotEmpty()
    courseId: Schema.Types.ObjectId;
    
    userId: Schema.Types.ObjectId;

    chapter: any;
}