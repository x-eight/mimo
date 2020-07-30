import { Controller, Logger, Post, Put, Delete, ValidationPipe, Body, Get, Query } from '@nestjs/common';
import { ChapterService } from './chapter.service';
import { NewChapter } from './dto/newChapter';
import { IChapter } from './chapter.schema';
import { UpdateChapter } from './dto/updateChapter';
import { CatchId } from './dto/catchId';

@Controller('chapter')
export class ChapterController {
    private logger = new Logger('ChapterController')
    constructor(
        private chapterService: ChapterService
    ){}

    @Post()
    newChapter(
        @Body(ValidationPipe) chapter: NewChapter,
    ):Promise<IChapter>{
        return this.chapterService.newChapter(chapter)
    }

    @Get('/total')
    getTotalChapter(
    ):Promise<IChapter[]>{
        return this.chapterService.getTotalChapter()
    }

    @Get('/course')
    getChapterOfCourse(
        @Query() id : CatchId,
    ): Promise<IChapter[]> {
        return this.chapterService.getChapterOfCourse(id)
    }

    @Get()
    getChapter(
        @Query() id : CatchId,
    ):Promise<IChapter>{
        return this.chapterService.getChapter(id)
    }

    @Put()
    updateChapter(
        @Query() id : CatchId,
        @Body(ValidationPipe) chapter: UpdateChapter,
    ):Promise<IChapter>{
        return this.chapterService.updateChapter(id, chapter)
    }

    @Delete()
    deleteChapte(
        id: string,
    ){
        return this.chapterService.deleteChapter(id)
    }

}
