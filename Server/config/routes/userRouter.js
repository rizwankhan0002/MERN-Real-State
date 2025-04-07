import express from 'express'
import { getProfile, test, updateProfile } from '../controllers/userController.js'
import authMiddleware from '../../middleware/authmiddlerware.js'

const userRouter = express.Router()

userRouter.get('/test', test )
userRouter.put('/update-profile',authMiddleware,updateProfile)
userRouter.get('/profile', authMiddleware, getProfile)

export default userRouter