import { Document, Schema, model } from 'mongoose';
import { db } from "../config/app";
import { Chapter } from 'src/chapter/chapter.schema';
//import { Chapter } from 'src/chapter/chapter.schema';


export interface IContent extends Document {
    name: string;
    chapterId: Schema.Types.ObjectId;
    slug: string;
    video: string;
    file: string;
    createAt: Date;
    updateAt: Date;
}

export const contentSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    chapterId: {
        type: Schema.Types.ObjectId,
        ref: db.collChapter,
    },
    slug: {
        type: String,
        default: "",
    },
    video: {
        type: String,
        default: "",
    },
    file: {
        type: String,
        default: "",
    },
    createAt: {
        type: Date,
        default: Date.now,
    },
    updateAt: {
        type: Date,
        default: Date.now,
    },
})

contentSchema.methods.toJSON = function () {
    const profile = this
    const profileObject = profile.toObject()
    delete profileObject.__v
    return profileObject
}

contentSchema.pre('remove', async function (next) {
    const profile = this
    //console.log(profile._id)
    //const test = await Chapter.deleteMany({ _id: profile.chapterId })
    //const test = await Chapter.findById("5f25bf0d0ca19a20238726fe")
    //console.log(test)
    //await Public.deleteMany({ userId: profile.chapterId })
    //await Friend.deleteMany({ userId: profile._id })
    
    next()
})

export const Content = model<IContent>(db.collContent, contentSchema)
