import { NextFunction, Request, Response } from 'express'
import ErrorHandler from '../middlewares/error.js'
import { Task } from '../models/task.js'
import { httpCode, isEmpty } from '../utils/features.js'

export const newTask = async (req: Request, res: Response, next: NextFunction) => {
    type ReqBody = {
        title: string
        description: string
    }

    try {
        const { title, description }: ReqBody = req.body

        if (isEmpty(title, description))
            return next(new ErrorHandler('ID not provided!', httpCode.badRequest))
        req.user
        await Task.create({
            title,
            description,
            user: req.user,
        })

        res.status(httpCode.resourceCreated).json({
            success: true,
            message: 'Task added Successfully',
        })
    } catch (error) {
        next(error)
    }
}

export const getMyTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user._id

        if (!userId) return next(new ErrorHandler('ID not provided!', httpCode.badRequest))

        const tasks = await Task.find({ user: userId })

        if (!tasks)
            return next(new ErrorHandler('Tasks Not Found for the user', httpCode.resourceNotFound))

        res.status(httpCode.successful).json({
            success: true,
            message: 'User Task Fetched',
            tasks,
        })
    } catch (error) {
        next(error)
    }
}

export const updateTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params
        const { userId } = req.params

        if (isEmpty(id)) return next(new ErrorHandler('ID not provided!', httpCode.badRequest))

        if (userId !== req.user.id)
            return next(new ErrorHandler('Not Authorized!', httpCode.notAuthorized))

        const task = await Task.findById(id)

        if (!task) return next(new ErrorHandler('Task not found', httpCode.resourceNotFound))

        task.isCompleted = !task.isCompleted
        await task.save()

        res.status(httpCode.successful).json({
            success: true,
            message: 'Task Updated!',
        })
    } catch (error) {
        next(error)
    }
}

export const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params
        const { userId } = req.params

        if (isEmpty(id)) return next(new ErrorHandler('ID not provided!', httpCode.badRequest))

        if (userId !== req.user.id)
            return next(new ErrorHandler('Not Authorized!', httpCode.notAuthorized))

        const task = await Task.findById(id)

        if (!task) return next(new ErrorHandler('Task not found', httpCode.resourceNotFound))

        await task.deleteOne()

        res.status(httpCode.successful).json({
            message: 'Task Deleted!',
            success: true,
        })
    } catch (error) {
        next(error)
    }
}
