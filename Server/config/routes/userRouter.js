import express from 'express'
import { deleteUser, getProfile, getUser, getUserListings, test, updateProfile } from '../controllers/userController.js'
import authMiddleware from '../../middleware/authmiddlerware.js'

const userRouter = express.Router()

userRouter.get('/test', test )
userRouter.put('/update-profile',authMiddleware,updateProfile)
userRouter.get('/profile', authMiddleware, getProfile)
userRouter.delete('/delete/:id',authMiddleware, deleteUser)
userRouter.get('/listings/:id', authMiddleware, getUserListings)
userRouter.get('/:id', authMiddleware, getUser)

export default userRouter