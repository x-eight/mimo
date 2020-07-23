import { Controller, Get, Query, ValidationPipe, Post, UsePipes, Body, Param, Put, ParseIntPipe, Delete, UseGuards, Logger } from '@nestjs/common';
import { UsersService } from './users.service';
import { NewUser } from './dto/new-user';
import { Users } from './users.schema';
import { RoleStatus } from './new.enum/role';
import { RoleValidationPipe, ValidateObjectId } from "./pipes/status-validation";
import { loginUser } from './dto/login';

@Controller('users')
export class UsersController {
    private logger = new Logger('UsersController');

    constructor(private usersService: UsersService){}

    @Post()
    async newUser(
        @Body() addUserDto: NewUser,
        //user: User,
    ):Promise<Users>{
        return this.usersService.newUser(addUserDto)
    }

    @Put('/:id')
    updateStatus(
        @Param('id', new ValidateObjectId()) id: string,
        @Body('status', RoleValidationPipe) status: RoleStatus,
        //@GetUser() user: User,
    ): Promise<Users> {
        return this.usersService.updateStatus(id, status);
    }

    @Post('/login')
    logIn(
        @Body(ValidationPipe) user: loginUser,
    ): Promise<{ accessToken: string }> {
        return this.usersService.logIn(user)
    }

    @Delete('/:id')
    deleteCourse(
        @Param('id', new ValidateObjectId()) id: string,
        //@GetUser() user: User,
    ):Promise<Users>{
        return this.usersService.deleteUser(id)
    }

/*
    @Post('/test')
    @UseGuards(AuthGuard())
    test(@GetUser() user: User){
        console.log(user)
    }

    @Post('/test1')
    @UseGuards(AuthGuard())
    test1(@Req() req){
        console.log(req)
    }
*/
}
