import mongoose from 'mongoose'

export const connectDB = () => {
    mongoose
        .connect(process.env.VITE_ENV_MONGO_URI!, {
            dbName: 'todoApp',
        })
        .then((c) => console.log(`Database Connected With ${c.connection.host}`))
        .catch((err) => console.log('Failed to connect to Database with error\n ' + err.message))
}
