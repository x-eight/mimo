import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Users } from "../users.schema";

export const GetUser = createParamDecorator((data, req: ExecutionContext): Users => {
    const request = req.switchToHttp().getRequest();
    const user = request.user;
    return user;
});