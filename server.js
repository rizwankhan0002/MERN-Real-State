import express from 'express'
import 'dotenv/config'
import connectDB from './Server/config/mongodb.js'
import userRouter from './Server/config/routes/userRouter.js'
import authRouter from './Server/config/routes/authRouter.js'
import cookieParser from 'cookie-parser'
import listRouter from './Server/config/routes/listingRouter.js'
import path from 'path'

const __dirname = path.resolve()

//App Config
const app = express()
const port = process.env.PORT || 5000
connectDB()

// Middlewares
app.use(express.json())   // To parse JSON bodies
app.use(cookieParser())   // To parse cookies (for JWT tokens)

app.use('/api/user', userRouter)
app.use('/api/auth', authRouter)
app.use('/api/listing', listRouter)


app.use(express.static(path.join(__dirname, '/client/dist')))

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'))
})

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500
    const message = err.message || 'Internal Server Error'
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    })
    })

app.listen(port, () => console.log('Server started on PORT : '+ port))