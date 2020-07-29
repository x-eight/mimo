import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from './payload';
import * as config from 'config';
import { IUsers } from '../users.schema';
import { jwt } from "../../config/app";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel("Users")
    private userRepository: Model<IUsers>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwt.secret,
    });
  }

  async validate(payload: JwtPayload): Promise<IUsers> {
    const { email } = payload;
    const user = await this.userRepository.findOne({ email });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}