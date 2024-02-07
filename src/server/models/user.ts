import { Document, ObjectId, Schema, model } from 'mongoose'

export interface IUser extends Document {
    name: string
    username: string
    password: string
    role: 'visitor' | 'admin' | 'testAdmin'
    createdAt: Date
    _id: ObjectId
}

const UserSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        select: false,
        required: true,
    },
    role: {
        type: String,
        default: 'visitor',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

export const User = model<IUser>('User', UserSchema)
