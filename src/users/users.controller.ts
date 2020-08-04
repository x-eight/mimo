import { Controller, ValidationPipe, Post, Body, Param, Put, Delete, UseGuards, Logger, Req, UseInterceptors, UploadedFile, Get, Res, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { NewUser } from './dto/new-user';
import { IUsers } from './users.schema';
import { RoleStatus } from './new.enum/role';
import { RoleValidationPipe } from "./pipes/status-validation";
import { loginUser } from './dto/login';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorator/user';
import { FileInterceptor } from "@nestjs/platform-express";
import { CatchId } from './dto/catchId';
import { UpdateUser } from './dto/updateUser';
import { LoginNumber, VerifyNumber } from './dto/verify';

@Controller('users')
export class UsersController {
    private logger = new Logger('UsersController');

    constructor(private usersService: UsersService){}

    @Post()
    async newUser(
        @Body(ValidationPipe) addUserDto: NewUser,
    ):Promise<IUsers>{
        return this.usersService.newUser(addUserDto)
    }

    @Post('/loginNumber')
    async newNumber(
        @Body(ValidationPipe) num: LoginNumber,
    ): Promise<{action: any}>{
        return this.usersService.newNumber(num)
    }

    @Post('/verify')
    async validateNumber(
        @Body(ValidationPipe) verifyNumber: VerifyNumber,
    ): Promise<{action: any}>{
        return this.usersService.validateNumber(verifyNumber)
    }

    @Post('/login')
    logIn(
        @Body(ValidationPipe) user: loginUser,
    ): Promise<{ accessToken: string }> {
        return this.usersService.logIn(user)
    }

    @Post('/mock/:num')
    async mockCourse(
        @Param('num') num: number
    ) {
        return this.usersService.mockCourse(num)
    }

    @Get()
    totalUser(
    ): Promise<IUsers[]>{
        return this.usersService.totalUser();
    }

    @Get('/home')
    @UseGuards(AuthGuard())
    homeUser(
        @GetUser() user: IUsers,
    ):Promise<IUsers> {
        return this.usersService.homeUser(user);
    }

    @Put()
    @UseGuards(AuthGuard())
    updateStatus(
        //@Body('status', RoleValidationPipe) status: RoleStatus,
        @Body(ValidationPipe) status: UpdateUser,
        @GetUser() user: IUsers,
    ): Promise<IUsers> {
        return this.usersService.updateStatus(user, status);
    }
    
    @Put('/image')
    @UseGuards(AuthGuard())
    @UseInterceptors(FileInterceptor('file'))
    uploadFile(
        @GetUser() user: IUsers,
        @UploadedFile() file
        ): Promise<string> {
        return this.usersService.uploadImg(user,file);
    }

    @Delete()
    @UseGuards(AuthGuard())
    deleteUser(
        @GetUser() user: IUsers,
    ):Promise<{ delete: string }>{
        return this.usersService.deleteUser(user)
    }

    @Delete('/mycourse')
    @UseGuards(AuthGuard())
    deleteCourse(
        @GetUser() user: IUsers,
        @Query('id') id : CatchId,
    ):Promise<IUsers>{
        return this.usersService.deleteCourse(user, id)
    }


}
