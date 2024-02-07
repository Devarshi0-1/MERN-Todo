import { IUser } from './../../models/user.js'

global {
    declare namespace Express {
        interface Request {
            user: IUser
        }
    }
}
