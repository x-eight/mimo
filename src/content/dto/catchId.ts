import { IsEmail, IsNotEmpty } from 'class-validator';
import { Schema } from 'mongoose';

export class CatchId {
    id: Schema.Types.ObjectId;
}


    