import { Module } from '@nestjs/common';
import { ChapterController } from './chapter.controller';
import { ChapterService } from './chapter.service';
import { db } from "../config/app";
import { MongooseModule } from '@nestjs/mongoose';
import { chapterSchema } from './chapter.schema';
import { courseSchema } from 'src/course/course.schema';
import { CourseModule } from 'src/course/course.module';

@Module({
  imports:[
    //create collection
    MongooseModule.forFeature([{ name: db.collChapter, schema: chapterSchema }]),
    //create collection
    MongooseModule.forFeature([{ name: db.collCourse, schema: courseSchema }]),

    CourseModule,
  ],
  controllers: [ChapterController],
  providers: [ChapterService]
})
export class ChapterModule {}
