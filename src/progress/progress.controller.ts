import { Controller, Post, Body, ValidationPipe, Logger, Put } from '@nestjs/common';
import { NewProgress } from './dto/newProgress';
import { ProgressService } from './progress.service';
import { IProgress } from './progress.schema';
import { StatusAdavance } from './new.enum/status';
import { UpdateProgress } from './dto/updateProgress';

@Controller('progress')
export class ProgressController {
    private logger = new Logger('UsersController');

    constructor(private progressService: ProgressService){}

    @Post()
    async newProgress(
        @Body(ValidationPipe) createProgress: NewProgress,
    ):Promise<IProgress>{
        return this.progressService.newProgress(createProgress)
    }

    @Put('/status')
    updateProgress(
        @Body(ValidationPipe) status: UpdateProgress,
        //@Body('status', RoleValidationPipe) status: StatusAdavance,
    ): Promise<IProgress> {
        return this.progressService.updateProgress(status);
    }

}
