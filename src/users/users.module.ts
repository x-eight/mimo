import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { userSchema } from './users.schema';
import { JwtStrategy } from './jwt/auth';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MulterModule } from '@nestjs/platform-express';
import { imageFilter } from './image/filter';
import { AwsUpload } from './image/aws';
import { jwt, db } from "../config/app";
import { progressSchema } from 'src/progress/progress.schema';


@Module({
  imports: [
    //create token
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: jwt.secret,
      signOptions: {
        expiresIn: jwt.expiresIn,
      },
    }),
    //create collection
    MongooseModule.forFeature([{ name: db.collUser, schema: userSchema }]),
    //create collection
    MongooseModule.forFeature([{ name: db.collProgress, schema: progressSchema }]),
    
    MulterModule.registerAsync({
      useFactory:()=>({
        fileFilter: imageFilter,
      })
    })
    
  ],
  controllers: [UsersController],
  providers: [
    JwtStrategy,//activate Bearer
    UsersService,
    AwsUpload,
  ],
  exports: [
      JwtStrategy,
      PassportModule,
    ],
})
export class UsersModule {}
