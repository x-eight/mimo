import { IsNotEmpty, IsString } from "class-validator";

export class UploadCourse {

    title: string;

    tema: string;

    language: string;

    description: string;

    slug: string;

}