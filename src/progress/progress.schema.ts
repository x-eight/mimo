import { Document, Schema, model } from 'mongoose';
import { db } from "../config/app";
import { StatusAdavance } from './new.enum/status';
//import { Chapter } from 'src/chapter/chapter.schema';


export interface IProgress extends Document {
    userId: Schema.Types.ObjectId,
    courseId:Schema.Types.ObjectId,
    chapter:any,
    createAt: Date;
    updateAt: Date;
}

export const progressSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: db.collUser,
    },
    courseId: {
        type: Schema.Types.ObjectId,
        ref: db.collCourse,
    },
    chapter: {
        type: Array,
        default: [],
    },
    /*
    chapter: [{
        type: String,
        default: [],
    }],
    */
    createAt: {
        type: Date,
        default: Date.now,
    },
    updateAt: {
        type: Date,
        default: Date.now,
    },
})

progressSchema.methods.toJSON = function () {
    const profile = this
    const profileObject = profile.toObject()
    delete profileObject.__v
    return profileObject
}

progressSchema.pre('remove', async function (next) {
    const profile = this
    
    next()
})

export const Progress = model<IProgress>(db.collProgress, progressSchema)

