import cookieParser from 'cookie-parser'
import cors from 'cors'
import { config } from 'dotenv'
import express from 'express'
import { errorMiddleware } from './middlewares/error.js'
import adminRouter from './routes/admin.js'
import taskRouter from './routes/task.js'
import userRouter from './routes/user.js'

export const app = express()

config()

app.use(express.json())
app.use(cookieParser())
app.use(
    cors({
        origin: [process.env.VITE_ENV_FRONTEND_URL!],
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true,
    }),
)

app.use('/api/v1/users', userRouter)
app.use('/api/v1/task', taskRouter)
app.use('/api/v1/admin', adminRouter)

app.use(errorMiddleware)
