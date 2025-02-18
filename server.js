import express from 'express'
import 'dotenv/config'
import connectDB from './Server/config/mongodb.js'
import userRouter from './Server/config/routes/userRouter.js'

//App Config
const app = express()
const port = process.env.PORT || 5000
connectDB()

app.use('/api/user', userRouter)

app.listen(port, () => console.log('Server started on PORT : '+ port))