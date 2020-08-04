import { Injectable, NotFoundException, Logger, NotImplementedException, UnauthorizedException } from '@nestjs/common';
import { NewUser } from './dto/new-user';
import { IUsers } from './users.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { loginUser } from './dto/login';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt/payload';
import * as fs from "fs";
import { internet } from "faker";
import { db, twi } from "../config/app";
import { MockUser } from 'mockData/user';
import { AwsUpload } from './image/aws';
import { CatchId } from './dto/catchId';
import { UpdateUser } from './dto/updateUser';
import { IProgress } from 'src/progress/progress.schema';
import * as Twilio from 'twilio';
import { LoginNumber, VerifyNumber } from './dto/verify';


@Injectable()
export class UsersService {
    private logger = new Logger('UsersService');
    constructor(
        @InjectModel(db.collUser)
        private userModel: Model<IUsers>,

        @InjectModel(db.collProgress)
        private progressModel: Model<IProgress>,

        private jwtService: JwtService,

        private aws: AwsUpload,
    ) { }

    async newNumber(
        phoneNumber: LoginNumber,
    ): Promise<{action: any}> {
        const { phone } = phoneNumber
        const client = Twilio(twi.accountSid, twi.authToken);
        try {
            // Validate E164 format
            if (!(/^\+?[1-9]\d{1,14}$/.test(phone))) {
                throw new NotFoundException('number must be E164 format!')
            }

            const test = client.verify.services(twi.serviceId).verifications
                .create({
                    to: phone,
                    channel: 'sms'
                }).then((message) => {
                    console.log("Verification is sent!!", message.status)
                    return message.status
                })
                .catch((error) => console.log("Verification dont sent!!", error))
            return {action: test}
        } catch (error) {
            this.logger.verbose(`validate failed with error: ${error}`);
            throw new NotFoundException(`validate failed with error: ${error}`)
        }

    }

    async validateNumber(
        verifyNumber: VerifyNumber,
    ): Promise<{action: any}> {
        const { phone, code } = verifyNumber
        const client = Twilio(twi.accountSid, twi.authToken);
        try {
            // Validate E164 format
            if (!(/^\+?[1-9]\d{1,14}$/.test(phone))) {
                throw new NotFoundException('number must be E164 format!')
            }
            const test = client.verify.services(twi.serviceId).verificationChecks
                .create({
                    to: phone,
                    code: code
                })
                .then(data => {
                    if (data.status === "approved") {
                        console.log("User is Verified!!", data.status)
                        return data.status
                    }
                })
                .catch((error) => console.log("Verification dont sent!!", error))
                return {action: test}
        } catch (error) {
            this.logger.verbose(`validate failed with error: ${error}`);
            throw new NotFoundException(`validate failed with error: ${error}`)
        }
    }

    async newUser(
        createUserDto: NewUser,
    ): Promise<IUsers> {
        const user = await this.userModel.findOne({ email: createUserDto.email })
        if (user) {
            throw new UnauthorizedException('enter another email');
        }
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

        const pssw = await user.validateUserPassword(loginUser.password)
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
        userToken: IUsers,
    ): Promise<IUsers> {
        try {
            const user = await this.userModel.findById(userToken.id).populate('courseId', 'title tema description updateAt')
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
        userToken: IUsers,
        status: UpdateUser,
    ): Promise<IUsers> {
        const updates = Object.keys(status)
        const allowed = ['status', 'email', 'password']
        const isValid = updates.every((update) => allowed.includes(update))
        if (!isValid) {
            throw new NotImplementedException(`keys invalid!!`);
        }
        const userEmail = await this.userModel.findOne({ email: status.email })
        if (userEmail) {
            throw new UnauthorizedException('enter another email');
        }

        try {
            const user = await this.userModel.findById(userToken.id);
            if (!user) {
                throw new NotImplementedException('dont exist user!')
            }

            updates.forEach((update1) => user[update1] = status[update1])
            user.updateAt = new Date()
            return user.save()
        } catch (error) {
            throw new NotImplementedException(`update failed with error: ${error}`)
        }

    }

    //---------------Image---------------//
    async uploadImg(
        userToken: IUsers,
        file,
    ): Promise<string> {

        const user = await this.userModel.findById(userToken.id);
        const url = await this.aws.fileupload(userToken.id, file).then(data => {
            return data
        }
        )

        try {
            const update = {
                "avatar.contentType": <string>file.mimetype,
                "avatar.data": url
            };
            user.updateAt = new Date()
            await user.updateOne(update);

            /////await this.userModel.findOne({ _id: userToken.id });
            return url
        } catch (error) {
            throw new NotImplementedException(`updateImg failed with error: ${error}`)
        }

    }


    async deleteUser(
        userToken: IUsers,
    ): Promise<{ delete: string }> {
        let sumProgress: number = 0
        try {
            const user = await this.userModel.findById(userToken.id)
            for (let index = 0; index < user.courseId.length; index++) {
                let Nprogress = await this.progressModel.deleteOne({ userId: userToken.id, courseId: user.courseId[index] })
                sumProgress = sumProgress + Nprogress.deletedCount
            }
            const result = await this.userModel.deleteOne({ _id: userToken.id });
            return { delete: `Deleted ${result.deletedCount} user and ${sumProgress} progress` }
        } catch (error) {
            this.logger.verbose(`Delete failed with error: ${error}`);
            throw new NotFoundException(`Delete failed with error: ${error}`)
        }

    }

    async deleteCourse(
        userToken: IUsers,
        courseId: CatchId,
    ): Promise<IUsers> {
        const { id } = courseId
        try {
            const user = await this.userModel.findById(userToken.id);

            user.courseId = user.courseId.filter(element => {
                return element != id
            });
            await user.save();
            return user
        } catch (error) {
            this.logger.verbose(`Delete failed with error: ${error}`);
            throw new NotFoundException(`Delete failed with error: ${error}`)
        }
    }

}
