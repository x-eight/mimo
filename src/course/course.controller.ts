import { Controller, Get, Logger, Body, Post, ValidationPipe, Param, UseGuards, Query, Put, Delete } from '@nestjs/common';
import { CourseService } from './course.service';
import { ICourse } from './course.schema';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/users/decorator/user';
import { NewCourse } from "./dto/newCourse";
import { CatchId } from "./dto/catchId";
import { UploadCourse } from './dto/uploadCourse';
import { SearchCourse } from './dto/search';
import { IUsers } from 'src/users/users.schema';
import { IChapter } from 'src/chapter/chapter.schema';
import { IContent } from 'src/content/content.schema';

@Controller('course')
export class CourseController {

    private logger = new Logger('UsersController');

    constructor(private courseService: CourseService){}

    @Post()
    async newCourse(
        @Body(ValidationPipe) addUserDto: NewCourse,
    ):Promise<ICourse>{
        return this.courseService.newCourse(addUserDto)
    }

    @Post('/add')
    @UseGuards(AuthGuard())
    async addCourseUser(
        @GetUser() user: IUsers,
        @Query() id : CatchId,
    ):Promise<ICourse>{
        return this.courseService.addCourseUser(user, id)
    }

    @Post('/mock/:num')
    async mockCourse(
        @Param('num') num: number
    ) {
        return this.courseService.mockCourse(num)
    }


    ///////////7--------------------------------////////
    @Get()
    totalCourse(
        @Query() search : SearchCourse,
    ):Promise<ICourse[]> {
        return this.courseService.totalCourse(search);
    }

    @Get('/:slug')
    getCoursoBySlug(
        @Param('slug') slug: string
    ):Promise<ICourse> {
        return this.courseService.getCoursoBySlug(slug);
    }

    @Get('/:slug0/:slug1')
    getChapterBySlug(
        @Param('slug0') slug0: string,
        @Param('slug1') slug1: string,
    ):Promise<IChapter> {
        return this.courseService.getChapterBySlug(slug0,slug1);
    }

    @Get('/:slug0/:slug1/:slug2')
    getContentBySlug(
        @Param('slug0') slug0: string,
        @Param('slug1') slug1: string,
        @Param('slug2') slug2: string,
    ):Promise<IContent> {
        return this.courseService.getContentBySlug(slug0,slug1,slug2);
    }

    ///////////7--------------------------------////////
    @Put()
    uploadCourse(
        @Query() id : CatchId,
        @Body(ValidationPipe) upload: UploadCourse,
        ):Promise<ICourse> {
        return this.courseService.uploadCourse(id, upload);
    }

    ///////////7--------------------------------////////

    @Delete()
    deleteCourse(
        @Query() id : CatchId,
    ):Promise<{ delete: string }>{
        return this.courseService.deleteCourse(id)
    }

}
