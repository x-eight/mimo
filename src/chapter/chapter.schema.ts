import { Document, Schema, model } from 'mongoose';
import { db } from "../config/app";


export interface IChapter extends Document {
    name: string;
    contentId : Schema.Types.ObjectId[];
    courseId: Schema.Types.ObjectId;
    slug: string;
    createAt: Date;
    updateAt: Date;
}

export const chapterSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    contentId: [{
        type: Schema.Types.ObjectId,
        ref: db.collContent,
    }],
    courseId: {
        type: Schema.Types.ObjectId,
        ref: db.collCourse,
    },
    slug: {
        type: String,
        default: ""
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

// Specifying a virtual with a `ref` property is how you enable virtual
// population
chapterSchema.virtual('course', {
    ref: db.collCourse,
    localField: '_id',
    foreignField: 'chapterId'
    //justOne: true
});

chapterSchema.methods.toJSON = function () {
    const profile = this
    const profileObject = profile.toObject()
    delete profileObject.__v
    return profileObject
}

export const Chapter = model<IChapter>(db.collChapter, chapterSchema)
