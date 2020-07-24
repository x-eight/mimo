import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import * as config from 'config';

const dbConfig = config.get('db');

@Module({
  imports: [
    
    MongooseModule.forRoot(`mongodb://localhost:27017/${dbConfig.db}`),
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
