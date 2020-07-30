import { Document, Schema, model } from 'mongoose';
import { db } from "../config/app";


export interface ICourse extends Document {
  title: string;
  tema: string;
  language: string;
  description: string;
  students: number;
  slug: string;
  chapterId: Schema.Types.ObjectId[];
  createAt: Date;
  updateAt: Date;
}

export const courseSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  tema: {
    type: String,
    required: true,
    trim: true
  },
  language: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  students: {
    type: Number,
    default: 0,
  },
  slug: {
    type: String,
    default: "",
  },
  chapterId: [{
    type: Schema.Types.ObjectId,
    ref: db.collChapter,
  }],
  createAt: {
    type: Date,
    default: Date.now,
  },
  updateAt: {
    type: Date,
    default: Date.now,
  },
})

courseSchema.methods.toJSON = function () {
  const profile = this
  const profileObject = profile.toObject()
  delete profileObject.__v
  return profileObject
}

export const Course = model<ICourse>(db.collCourse, courseSchema)


