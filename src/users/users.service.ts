import { Injectable, NotFoundException, Logger, NotImplementedException, UnauthorizedException } from '@nestjs/common';
import { NewUser } from './dto/new-user';
import { IUsers } from './users.schema';
import { RoleStatus } from './new.enum/role';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { loginUser } from './dto/login';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt/payload';
import * as fs from "fs";
import { internet } from "faker";
import { db } from "../config/app";
import { MockUser } from 'mockData/user';
import { AwsUpload } from './image/aws';
import { CatchId } from './dto/catchId';


@Injectable()
export class UsersService {
    private logger = new Logger('UsersService');
    constructor(
        @InjectModel(db.collUser)
        private userModel: Model<IUsers>,

        private jwtService: JwtService,

        private aws: AwsUpload,
    ) { }

    async newUser(
        createUserDto: NewUser,
    ): Promise<IUsers> {
        const createdUser = new this.userModel(createUserDto);
        return createdUser.save();
    }

    async logIn(
        loginUser: loginUser,
    ): Promise<{ accessToken: string }> {
        const user = await this.userModel.findOne({ email: loginUser.email })
        if (!user) {
            throw new UnauthorizedException('Invalid email');
        }

        const pssw = await (<IUsers>user).validateUserPassword(loginUser.password)
        if (!pssw) {
            throw new UnauthorizedException('password invalid')
        }

        const payload: JwtPayload = { email: loginUser.email }
        const accessToken = await this.jwtService.sign(payload);

        return { accessToken };

    }

    async mockCourse(
        num: number,
    ) {
        let users = [];
        for (let index = 0; index < num; index++) {
            let generateData: MockUser = {
                email: internet.email(),
                password: internet.password(),
            }
            const createdUser = await new this.userModel(generateData);
            users.push(generateData);
            await createdUser.save();
        }

        fs.writeFileSync("src/users/dto/data.json", JSON.stringify(users, null, "\t"));

    }

    async totalUser(
    ): Promise<IUsers[]> {
        const createdUser = await this.userModel.find()
        return createdUser
    }

    async homeUser(
        userToken: User,
    ): Promise<IUsers> {//
        try {
            const user = await this.userModel.findById(userToken.id).populate('courseId', 'title tema language description updateAt')
            if (!user) {
                this.logger.verbose(`dont exist user`);
                throw new NotImplementedException(`dont exist user`);
            }
            return user
        } catch (error) {
            throw new NotImplementedException(error);
        }
    }

    async updateStatus(
        userToken: User,
        status: RoleStatus,
    ): Promise<IUsers> {
        const user = await this.userModel.findById(userToken.id)
        user.status = status
        user.updateAt = new Date()
        await user.save()
        return user
    }

    //---------------Image---------------//
    async uploadImg(
        userToken: User,
        file,
    ): Promise<string> {

        const user = await this.userModel.findById(userToken.id);
        const url = this.aws.fileupload(userToken.id, file)

        const update = {
            "avatar.contentType": <string>file.mimetype,
            "avatar.data": url
        };
        user.updateAt = new Date()
        await user.updateOne(update);

        const updatedDoc = await this.userModel.findOne({ _id: userToken.id });
        return url

    }


    async deleteUser(
        userToken: User,
    ): Promise<IUsers> {
        const user = await this.userModel.findById(userToken.id)

        if (!user) {
            this.logger.verbose(`user with ID "${userToken.id}" cant delete`);
            throw new NotImplementedException(`user with ID "${userToken.id}" cant delete`);
        }
        const id = userToken.id
        await this.userModel.deleteOne({ _id: id });
        return user;
    }

    async deleteCourse(
        userToken: User,
        courseId: CatchId,
    ): Promise<IUsers> {
        const { id } = courseId
        try {
            const user = await this.userModel.findById(userToken.id);
            if (!user) {
                this.logger.verbose(`dont exist course`);
                throw new NotImplementedException(`dont exist course`);
            }
            user.courseId = user.courseId.filter(element => {
                return element !== id
            });
            await user.save();
            return user
        } catch (error) {
            throw new NotImplementedException(error);
        }
    }

}
