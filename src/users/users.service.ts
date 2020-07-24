import { Injectable, NotFoundException, Logger, NotImplementedException, UnauthorizedException } from '@nestjs/common';
import { NewUser } from './dto/new-user';
import { Users, IUsers } from './users.schema';
import { RoleStatus } from './new.enum/role';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { loginUser } from './dto/login';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt/payload';
import * as config from 'config';

const dbConfig = config.get('db');


@Injectable()
export class UsersService {
    private logger = new Logger('UsersService');
    constructor(
        @InjectModel(dbConfig.dbUser)
        private UserModel: Model<Users>,
        private jwtService: JwtService,
    ) {}

    async totalUser(
    ): Promise<Users[]> {
        const createdUser = await this.UserModel.find()
        return createdUser
    }

    async newUser(
        createUserDto: NewUser,
        //user: User,
    ): Promise<Users> {
        const createdUser = new this.UserModel(createUserDto);
        return createdUser.save();
    }

    async updateStatus(
        userToken: User,
        status: RoleStatus,
    ): Promise<Users> {
        const user = await this.UserModel.findById(userToken.id)
        user.status = status
        await user.save()
        return user
    }

    async logIn(
        loginUser: loginUser,
    ): Promise<{ accessToken: string }> {
        const user = await this.UserModel.findOne({ email: loginUser.email })
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

    async deleteUser(
        userToken: User,
    ): Promise<Users> {
        const user = await this.UserModel.findById(userToken.id)

        if (!user) {
            this.logger.verbose(`user1 with ID "${userToken.id}" cant delete`);
            throw new NotImplementedException(`user1 with ID "${userToken.id}" cant delete`);
        }
        const id = userToken.id
        await this.UserModel.deleteOne({ _id: id });
        return user;
    }

    //---------------Image---------------//
    async uploadImg(
        userToken: User,
        file,
    ) {

        const doc = await this.UserModel.findOne({ _id: userToken.id });

        const update = {
            "avatar.contentType": <string>file.mimetype,
            "avatar.data": file.buffer};
            //"avatar.data": <Buffer>file.buffer};
        await doc.updateOne(update);

        const updatedDoc = await this.UserModel.findOne({ _id: userToken.id });
        return updatedDoc

    }

    async watchImg(
        userToken: User,
        res,
    ) {
        const image = await this.UserModel.findOne({ _id: userToken.id });
        res.setHeader("Content-Type", image.avatar.contentType)
        return res.send(image.avatar.data.buffer)
    }

}
