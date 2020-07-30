import { IsNotEmpty, IsString } from "class-validator";

export class UpdateChapter {
    @IsNotEmpty()
    @IsString()
    name: string;

    slug: string;

}