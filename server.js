import express from 'express'
import 'dotenv/config'
import connectDB from './Server/config/mongodb.js'
import userRouter from './Server/config/routes/userRouter.js'
import authRouter from './Server/config/routes/authRouter.js'

//App Config
const app = express()
const port = process.env.PORT || 5000
connectDB()

// Middlewares
app.use(express.json())

app.use('/api/user', userRouter)
app.use('/api/auth', authRouter)

app.listen(port, () => console.log('Server started on PORT : '+ port))