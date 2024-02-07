import { NextFunction, Request, Response } from 'express'
import ErrorHandler from '../middlewares/error.js'
import { Task } from '../models/task.js'
import { User } from '../models/user.js'
import { httpCode, isEmpty } from '../utils/features.js'

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await User.find({})

        if (!users) return new ErrorHandler('Users not found!', httpCode.resourceNotFound)

        return res.status(httpCode.successful).json({
            success: true,
            message: 'All Users Fetched',
            users,
        })
    } catch (error) {
        next(error)
    }
}

export const getUserTasks = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params

        if (isEmpty(id)) return new ErrorHandler('No User Id Found!', httpCode.badRequest)

        const user = await User.findById(id)

        if (!user) return new ErrorHandler('No User Found!', httpCode.resourceNotFound)

        const tasks = await Task.find({ user: user._id })

        if (!tasks)
            return new ErrorHandler('No Tasks Found for the User!', httpCode.resourceNotFound)

        res.json({
            success: true,
            tasks,
        })
    } catch (error) {
        next(error)
    }
}

export const getAllTasks = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params

        if (isEmpty(id)) return new ErrorHandler('No User Id Found!', httpCode.badRequest)

        const tasks = await Task.find({ user: id })

        if (!tasks)
            return new ErrorHandler('No Tasks Found for the User!', httpCode.resourceNotFound)

        return res.status(httpCode.successful).json({
            success: true,
            message: 'All Tasks Fetched',
            tasks,
        })
    } catch (error) {
        next(error)
    }
}

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params

        if (isEmpty(id)) return next(new ErrorHandler('User Not Present!', httpCode.badRequest))

        const user = await User.findById(id)

        if (!user) return next(new ErrorHandler('User not found!', httpCode.resourceNotFound))

        console.log(user.role)

        if (user.role === 'admin')
            return next(new ErrorHandler('Not Authorized!', httpCode.notAuthorized))

        await Task.deleteMany({ user: user._id })

        await user.deleteOne()

        res.status(httpCode.successful).json({
            success: true,
            message: 'User Deleted!',
        })
    } catch (error) {
        next(error)
    }
}

export const updateUserTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params

        if (isEmpty(id)) return next(new ErrorHandler('ID not provided!', httpCode.badRequest))

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

export const deleteUserTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params

        if (isEmpty(id)) return next(new ErrorHandler('ID not provided!', httpCode.badRequest))

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
