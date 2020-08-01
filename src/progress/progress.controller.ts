import { Controller, Post, Body, ValidationPipe, Logger, Put, Get, Query, UseGuards } from '@nestjs/common';
import { NewProgress } from './dto/newProgress';
import { ProgressService } from './progress.service';
import { IProgress } from './progress.schema';
import { StatusAdavance } from './new.enum/status';
import { UpdateProgress } from './dto/updateProgress';
import { CatchId } from './dto/catchId';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/users/decorator/user';
import { IUsers } from 'src/users/users.schema';

@Controller('progress')
@UseGuards(AuthGuard())
export class ProgressController {
    private logger = new Logger('UsersController');

    constructor(private progressService: ProgressService){}

    @Post()
    async newProgress(
        @GetUser() user: IUsers,
        @Body(ValidationPipe) createProgress: NewProgress,
    ):Promise<IProgress>{
        return this.progressService.newProgress(user, createProgress)
    }

    @Put('/status')
    updateProgress(
        @GetUser() user: IUsers,
        @Body(ValidationPipe) status: UpdateProgress,
    ): Promise<IProgress> {
        return this.progressService.updateProgress(user, status);
    }

    @Get()
    getProgress(
        @GetUser() user: IUsers,
        @Query() id : CatchId,
    ): Promise<IProgress> {
        return this.progressService.getProgress(user, id);
    }

}
