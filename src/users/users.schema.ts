import { Prop, Schema, SchemaFactory, ModelDefinition } from '@nestjs/mongoose';
import { Document, Mongoose } from 'mongoose';
import { RoleStatus } from './new.enum/role';
import * as bcrypt from 'bcrypt';


export interface IUsers extends Document {
  email: string;
  password: string;
  avatar: string;
  status: RoleStatus;
  validateUserPassword: (password: string) => Promise<Boolean>;
}

@Schema()
export class Users extends Document {

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  avatar: string;

  @Prop()
  status: RoleStatus;

}

export const UserSchema = SchemaFactory.createForClass(Users);


UserSchema.pre<IUsers>("save", async function(next) {
  const user = this;
  
  if (!user.isModified("password")) return next();
  /*
  user.salt = await bcrypt.genSalt()
  user.password = await bcrypt.hash(password, user.salt);
  */
  const hash = await bcrypt.hash(user.password, 8);
  user.password = hash;
  next();
});

UserSchema.methods.validateUserPassword = async function (password: string): Promise<string>{
  return await bcrypt.compare(password, this.password);
}

