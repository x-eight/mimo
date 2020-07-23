import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import * as config from 'config';

const dbConfig = config.get('db');

@Module({
  imports: [
    //MongooseModule.forRoot("mongodb+srv://saul:1234@cluster0-ooeaq.mongodb.net/chat?retryWrites=true&w=majority"),
    MongooseModule.forRoot(`mongodb+srv://${dbConfig.username}:${dbConfig.password}@cluster0-ooeaq.mongodb.net/${dbConfig.db}?retryWrites=true&w=majority`),
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
