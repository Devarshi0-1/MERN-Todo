import bcrypt from 'bcrypt'
import { NextFunction, Request, Response } from 'express'
import ErrorHandler from '../middlewares/error.js'
import { User } from '../models/user.js'
import { httpCode, isEmpty, sendCookie } from '../utils/features.js'

export const login = async (req: Request, res: Response, next: NextFunction) => {
    type ReqBody = {
        username: string
        password: string
    }

    try {
        const { username, password }: ReqBody = req.body

        if (isEmpty(username, password))
            return next(new ErrorHandler('Username or Password not provided!', httpCode.badRequest))

        const user = await User.findOne({ username }).select('+password')

        if (!user)
            return next(new ErrorHandler('Invalid Username or Password', httpCode.badRequest))

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch)
            return next(new ErrorHandler('Invalid Username or Password', httpCode.badRequest))

        sendCookie(user, res, `Welcome back, ${user.name}`, httpCode.successful)
    } catch (error) {
        next(error)
    }
}

export const register = async (req: Request, res: Response, next: NextFunction) => {
    type ReqBody = {
        name: string
        username: string
        password: string
    }

    try {
        const { name, username, password }: ReqBody = req.body

        if (isEmpty(name, username, password))
            return next(
                new ErrorHandler('Name, Username or Password not provided!', httpCode.badRequest)
            )

        let user = await User.findOne({ username })

        if (user) return next(new ErrorHandler('User Already Exist', httpCode.badRequest))

        const hashedPassword = await bcrypt.hash(password, 10)

        user = await User.create({ name, username, password: hashedPassword })

        sendCookie(user, res, 'Registered Successfully', httpCode.resourceCreated)
    } catch (error) {
        next(error)
    }
}

export const getMyProfile = (req: Request, res: Response) => {
    res.status(httpCode.successful).json({
        success: true,
        message: 'User Profile Fetched',
        user: req.user,
    })
}

export const logout = (req: Request, res: Response) => {
    res.status(httpCode.successful)
        .cookie('token', '', {
            expires: new Date(Date.now()),
            sameSite: process.env.VITE_ENV_NODE_ENV === 'Development' ? 'lax' : 'none',
            secure: process.env.VITE_ENV_NODE_ENV === 'Development' ? false : true,
        })
        .json({
            success: true,
            user: req.user,
        })
}
