import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CourseModule } from './course/course.module';
import { db } from "./config/app";

@Module({
  imports: [

    MongooseModule.forRoot(`mongodb://localhost:27017/${db.database}`),
    UsersModule,
    CourseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
