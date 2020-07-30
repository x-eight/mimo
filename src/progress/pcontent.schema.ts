/*
import { Document, Schema, model } from 'mongoose';
import { db } from "../config/app";
import { Status } from './new.enum/status';

export interface IPcontent extends Document {
    progressId: Schema.Types.ObjectId,
    advace: {contentId:Schema.Types.ObjectId,ready:Status};
    createAt: Date;
    updateAt: Date;
}

export const pcontentSchema = new Schema({
    progressId: {
        type: Schema.Types.ObjectId,
        ref: db.collUser
    },
    advance:{
        type: {contentId: Schema.Types.ObjectId,ready:Status},
        ref: {contentId: db.collContent},
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

pcontentSchema.methods.toJSON = function () {
    const profile = this
    const profileObject = profile.toObject()
    delete profileObject.__v
    return profileObject
}

pcontentSchema.pre('remove', async function (next) {
    const profile = this
    
    next()
})

export const Pcontent = model<IPcontent>(db.collProgress, pcontentSchema)
*/