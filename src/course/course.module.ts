import { Module } from '@nestjs/common';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { MongooseModule } from '@nestjs/mongoose';
import { userSchema } from 'src/users/users.schema';
import { db } from "../config/app";
import { courseSchema } from "./course.schema";
import { UsersModule } from 'src/users/users.module';
import { progressSchema } from 'src/progress/progress.schema';

@Module({
  imports: [
    //create collection
    MongooseModule.forFeature([{ name: db.collCourse, schema: courseSchema }]),
    //create collection
    MongooseModule.forFeature([{ name: db.collUser, schema: userSchema }]),
    //create collection
    MongooseModule.forFeature([{ name: db.collProgress, schema: progressSchema }]),

    UsersModule,
  ],
  controllers: [CourseController],
  providers: [CourseService]
})
export class CourseModule {}
