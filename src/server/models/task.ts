import { Document, ObjectId, Schema, model } from 'mongoose'

export interface ITask extends Document {
    user: ObjectId
    title: string
    description: string
    isCompleted: boolean
    createdAt: Date
    _id: ObjectId
}

const TaskSchema: Schema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    isCompleted: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

export const Task = model<ITask>('Task', TaskSchema)
