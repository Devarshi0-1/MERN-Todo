import { Response } from 'express'
import jwt from 'jsonwebtoken'
import { IUser } from '../models/user.js'

export const sendCookie = (
    user: IUser,
    res: Response,
    message: string,
    statusCode: number = 200,
) => {
    const maxAge = 15 * 24 * 60 * 60 * 1000

    const token = jwt.sign({ _id: user._id }, process.env.VITE_ENV_JWT_SECRET!)
    res.status(statusCode)
        .cookie('token', token, {
            httpOnly: true,
            maxAge,
            sameSite: process.env.VITE_ENV_NODE_ENV === 'DEVELOPMENT' ? 'lax' : 'none',
            secure: process.env.VITE_ENV_NODE_ENV === 'DEVELOPMENT' ? false : true,
            // @ts-ignore
            origin: '/',
        })
        .json({
            success: true,
            message,
        })
}

export const isEmpty = (...strings: string[]) => {
    strings.forEach((str) => {
        if (str === null || str === undefined || str.length <= 0 || isHavingOnlyWhiteSpaces(str))
            return true
    })
    return false
}

const isHavingOnlyWhiteSpaces = (elem: string) => {
    if (elem.replace(/\s/g, '').length) return false
    return true
}

export const httpCode = {
    successful: 200,
    resourceCreated: 201,
    badRequest: 400,
    notAuthorized: 401,
    resourceNotFound: 404,
    internalServerError: 500,
}
