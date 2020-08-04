import { Controller, Logger, Post, Put, Delete, Body, ValidationPipe, Get, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ContentService } from './content.service';
import { NewContent } from './dto/newContent';
import { IContent } from './content.schema';
import { UpdateContent } from './dto/updateContent';
import { CatchId } from './dto/catchId';
import { FileInterceptor } from '@nestjs/platform-express';
import { Schema } from 'mongoose';

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

    @Put('/file')
    @UseInterceptors(FileInterceptor('file'))
    uploadFile(
        @Query() id : CatchId,
        @UploadedFile() file
        ): Promise<string> {
        console.log(id)
        return this.contentService.uploadFile(id,file);
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
        @Query() contendId: CatchId,
    ):Promise<{ delete: string }>{
        return this.contentService.deleteContent(contendId)
    }


}
