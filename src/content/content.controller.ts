import { Controller, Logger, Post, Put, Delete, Body, ValidationPipe, Get, Query } from '@nestjs/common';
import { ContentService } from './content.service';
import { NewContent } from './dto/newContent';
import { IContent } from './content.schema';
import { UpdateContent } from './dto/updateContent';
import { CatchId } from './dto/catchId';

@Controller('content')
export class ContentController {
    private logger = new Logger('ContentController')
    constructor(
        private contentService: ContentService
    ){}

    @Post()
    newContent(
        @Body(ValidationPipe) content: NewContent,
    ):Promise<IContent>{
        return this.contentService.newContent(content)
    }

    @Get('/total')
    getTotalContent(
    ):Promise<IContent[]>{
        return this.contentService.getTotalContent()
    }

    @Get('/chapter')
    getContentOfChapter(
        @Query() id : CatchId,
    ): Promise<IContent[]> {
        return this.contentService.getContentOfChapter(id)
    }

    @Get()
    getContent(
        @Query() id : CatchId,
    ):Promise<IContent>{
        return this.contentService.getContent(id)
    }

    @Put()
    updateChapter(
        @Query() id : CatchId,
        @Body(ValidationPipe) chapter: UpdateContent,
    ):Promise<IContent>{
        return this.contentService.updateContent(id, chapter)
    }

    @Delete()
    deleteChapte(
        id: string,
    ):Promise<IContent>{
        return this.contentService.deleteContent(id)
    }


}
