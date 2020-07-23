import { Controller, ValidationPipe, Post, Body, Param, Put, Delete, UseGuards, Logger, Req, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UsersService } from './users.service';
import { NewUser } from './dto/new-user';
import { Users } from './users.schema';
import { RoleStatus } from './new.enum/role';
import { RoleValidationPipe, ValidateObjectId } from "./pipes/status-validation";
import { loginUser } from './dto/login';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorator/user';
import { FileInterceptor } from "@nestjs/platform-express";

@Controller('users')
export class UsersController {
    private logger = new Logger('UsersController');

    constructor(private usersService: UsersService){}

    @Post()
    async newUser(
        @Body() addUserDto: NewUser,
        //@Body('status', RoleValidationPipe) addUserDto: NewUser,
    ):Promise<Users>{
        return this.usersService.newUser(addUserDto)
    }

    @Post('/login')
    logIn(
        @Body(ValidationPipe) user: loginUser,
    ): Promise<{ accessToken: string }> {
        return this.usersService.logIn(user)
    }

    @Post('/image')
    @UseInterceptors(FileInterceptor('file'))
        uploadFile(@UploadedFile() file) {
        console.log(file);
    }

    @Put()
    @UseGuards(AuthGuard())
    updateStatus1(
        @Body('status', RoleValidationPipe) status: RoleStatus,
        @GetUser() user: User,
    ): Promise<Users> {
        return this.usersService.updateStatus(user, status);
    }

    @Delete()
    @UseGuards(AuthGuard())
    deleteCourse(
        //@Param('id', new ValidateObjectId()) id: string,
        @GetUser() user: User,
    ):Promise<Users>{
        return this.usersService.deleteUser(user)
    }

    /*----test token---*/
    @Post('/test')
    @UseGuards(AuthGuard())
    test(@GetUser() user: User){
        console.log(user)
        return user
    }

    @Post('/test1')
    @UseGuards(AuthGuard())
    test1(@Req() req){
        console.log(req.user)
        return req.user
    }

}
