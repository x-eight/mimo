import { Module } from '@nestjs/common';
import { ProgressController } from './progress.controller';
import { ProgressService } from './progress.service';
import { MongooseModule } from '@nestjs/mongoose';
import { db } from 'src/config/app';
import { progressSchema } from './progress.schema';
import { userSchema } from 'src/users/users.schema';
import { courseSchema } from 'src/course/course.schema';
import { chapterSchema } from 'src/chapter/chapter.schema';
import { contentSchema } from 'src/content/content.schema';

@Module({
  imports:[
    //create collection
    MongooseModule.forFeature([{ name: db.collProgress, schema: progressSchema }]),
    //create collection
    MongooseModule.forFeature([{ name: db.collUser, schema: userSchema }]),
    //create collection
    MongooseModule.forFeature([{ name: db.collCourse, schema: courseSchema }]),
    //create collection
    MongooseModule.forFeature([{ name: db.collChapter, schema: chapterSchema }]),
    //create collection
    MongooseModule.forFeature([{ name: db.collContent, schema: contentSchema }]),
  ],
  controllers: [ProgressController],
  providers: [ProgressService]
})
export class ProgressModule {}
