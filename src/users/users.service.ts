import { Injectable, NotFoundException, Logger, NotImplementedException, UnauthorizedException } from '@nestjs/common';
import { NewUser } from './dto/new-user';
import { Users, IUsers } from './users.schema';
import { RoleStatus } from './new.enum/role';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { loginUser } from './dto/login';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt/payload';


@Injectable()
export class UsersService {
    private logger = new Logger('UsersService');
    constructor(
        @InjectModel("Users")
        private UserModel: Model<Users>,
        private jwtService: JwtService,
    ){}

    async newUser(
        createUserDto: NewUser,
        //user: User,
    ):Promise<Users>{
        const createdUser = new this.UserModel(createUserDto);
        return createdUser.save();
    }

    async updateStatus(
        userToken: User,
        status: RoleStatus,
    ):Promise<Users>{
        const user = await this.UserModel.findById(userToken.id)
        user.status = status
        await user.save()
        return user
    }

    async logIn(
        loginUser: loginUser,
    ):Promise<{ accessToken: string }>{
        const user = await this.UserModel.findOne({email: loginUser.email})
        //const email = await this.userRepository.validateUserPassword(user)
        if (!user) {
            throw new UnauthorizedException('Invalid email');
        }

        const pssw = (<IUsers>user).validateUserPassword(user.password)
        if (!pssw) {
            throw new UnauthorizedException('password invalid')
        }

        const payload: JwtPayload = { email:loginUser.email }
        const accessToken = await this.jwtService.sign(payload);

        return { accessToken };

    }

    async deleteUser(
        userToken: User,
        //id: string
    ): Promise<Users> {
        const user = await this.UserModel.findById(userToken.id)

    if (!user){
        this.logger.verbose(`user1 with ID "${userToken.id}" cant delete`);
        throw new NotImplementedException(`user1 with ID "${userToken.id}" cant delete`);
    }
    const id = userToken.id
    await this.UserModel.deleteOne({_id:id});
    return user;
    }

}
