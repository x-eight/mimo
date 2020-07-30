import { Module } from '@nestjs/common';
import { ContentController } from './content.controller';
import { ContentService } from './content.service';
import { db } from "../config/app";
import { MongooseModule } from '@nestjs/mongoose';
import { contentSchema } from './content.schema';
import { chapterSchema } from 'src/chapter/chapter.schema';

@Module({
  imports:[
    //create collection
    MongooseModule.forFeature([{ name: db.collContent, schema: contentSchema }]),
    //create collection
    MongooseModule.forFeature([{ name: db.collChapter, schema: chapterSchema }]),
  ],
  controllers: [ContentController],
  providers: [ContentService]
})
export class ContentModule {}
