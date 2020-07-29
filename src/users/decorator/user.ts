import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { IUsers } from "../users.schema";

export const GetUser = createParamDecorator((data, req: ExecutionContext): IUsers => {
    const request = req.switchToHttp().getRequest();
    const user = request.user;
    return user;
});