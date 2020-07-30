import { IsNotEmpty, IsString } from "class-validator";

export class UpdateProgress {
    @IsNotEmpty()
    @IsString()
    CourseId: string;

    @IsNotEmpty()
    @IsString()
    ChapterId: string;

    @IsNotEmpty()
    @IsString()
    ContentId: string;

}