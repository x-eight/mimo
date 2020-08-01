import { Document, Schema, model } from 'mongoose';
import { RoleStatus } from './new.enum/role';
import * as bcrypt from 'bcrypt';
import { db } from "../config/app";


export interface IUsers extends Document {
  _id: Schema.Types.ObjectId;
  email: string;
  password: string;
  avatar: {data:string, contentType:string};
  status: RoleStatus;
  courseId: Schema.Types.ObjectId[];
  createAt: Date;
  updateAt: Date;
  validateUserPassword: (password: string) => Promise<Boolean>;
}

export const userSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, auto: true },
  email:{
      type: String,
      required: true,
      trim: true
  },
  password:{
    type: String,
    required: true,
    trim: true
  },
  avatar:{
    type: {data:String, contentType:String},
    default: {contentType:"NOT IMAGEN"},
  },
  status:{
    type: RoleStatus,
    default: RoleStatus.STU,
  },
  courseId:[{
      type: Schema.Types.ObjectId,
      ref: db.collCourse,
  }],
  createAt: {
    type: Date,
    default: Date.now,
  },
  updateAt:{
    type: Date,
    default: Date.now,
  },
})


userSchema.methods.toJSON = function () {
  const profile = this
  const profileObject = profile.toObject()
  delete profileObject.__v
  return profileObject
}

userSchema.pre<IUsers>("save", async function(next) {
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

userSchema.methods.validateUserPassword = async function (password: string): Promise<Boolean>{
  //const user = this;

  //const hash = await bcrypt.hash(password, this.salt);
  //return hash === this.password;
  return await bcrypt.compare(password, this.password);
}

export const User = model<IUsers>(db.collUser, userSchema)
