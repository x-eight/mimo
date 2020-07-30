import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CourseModule } from './course/course.module';
import { db } from "./config/app";
import { ChapterModule } from './chapter/chapter.module';
import { ContentModule } from './content/content.module';
import { ProgressModule } from './progress/progress.module';

@Module({
  imports: [

    MongooseModule.forRoot(`mongodb://localhost:27017/${db.database}`),
    UsersModule,
    CourseModule,
    ChapterModule,
    ContentModule,
    ProgressModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
