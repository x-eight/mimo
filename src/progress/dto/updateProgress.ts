import { IsNotEmpty, IsString, IsOptional, IsIn } from "class-validator";
import { Schema } from "mongoose";
import { StatusAdavance } from "../new.enum/status";

export class UpdateProgress {
    @IsNotEmpty()
    @IsString()
    CourseId: Schema.Types.ObjectId;

    @IsNotEmpty()
    @IsString()
    ChapterId: Schema.Types.ObjectId;

    @IsNotEmpty()
    @IsString()
    ContentId: Schema.Types.ObjectId;

    @IsOptional()
    @IsIn([StatusAdavance.YES, StatusAdavance.NO])
    advance: StatusAdavance ;

}