/*
import { InternalServerErrorException, Logger } from '@nestjs/common';
import { Users } from "./users.schema";
import { RoleStatus } from "./new.enum/role";
import { NewUser } from "./dto/new-user";


export class UserRepository{
  private logger = new Logger('TaskRepository');

  async newUser(
    dataUser: NewUser,
    //user: User,
  ):Promise<Users>{
    //console.log(dataUser)
    const { email, password, avatar } = dataUser

    const newUser = new Users();
    newUser.email = email
    newUser.password = password;
    newUser.avatar = avatar
    newUser.status = RoleStatus.STU;

    try {
      await newUser.save();
    } catch (error) {
      this.logger.error(`Failed to create user Data: ${dataUser}`, error.stack);
      throw new InternalServerErrorException();
    }

    return newUser;
  }

}
*/