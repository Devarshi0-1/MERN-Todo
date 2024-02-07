import ViteExpress from 'vite-express'
import { connectDB } from './data/database.js'
import { app } from './main.js'

connectDB()

ViteExpress.listen(app, 3000, () => {
    console.log(
        `Server is working on PORT:${process.env.VITE_ENV_PORT} in ${process.env.NODE_ENV} Mode`,
    )
})
