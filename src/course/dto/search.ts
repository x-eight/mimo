import { IsNotEmpty, IsString } from "class-validator";

export class SearchCourse {
    @IsNotEmpty()
    @IsString()
    search: string;
}