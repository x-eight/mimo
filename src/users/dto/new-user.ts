import { IsNotEmpty } from "class-validator";
import { RoleStatus } from "../new.enum/role";

export class NewUser {
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    password: string;

    avatar: RoleStatus;
}