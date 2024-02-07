import { NextFunction, Request, Response } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { Types } from 'mongoose'
import { User } from '../models/user.js'
import { httpCode } from '../utils/features.js'
import ErrorHandler from './error.js'

type TJWTDecoded = {
    _id: Types.ObjectId
} & JwtPayload

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.cookies

    if (!token)
        return res.status(httpCode.resourceNotFound).json({
            success: false,
            message: 'Login First',
        })

    const decoded = jwt.verify(token, process.env.VITE_ENV_JWT_SECRET!) as TJWTDecoded

    const user = await User.findById(decoded._id)

    if (!user) return next(new ErrorHandler('No User found!', httpCode.resourceNotFound))

    req.user = user

    next()
}

export const checkRole = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!roles.includes(req.user.role))
            return res.status(httpCode.notAuthorized).json({
                success: false,
                message: 'Access Denied!',
            })
        next()
    }
}
