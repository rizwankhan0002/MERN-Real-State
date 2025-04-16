import express from 'express'
import { createListing, deleteListing } from '../controllers/listingController.js'
import authMiddleware from '../../middleware/authmiddlerware.js'

const listRouter = express.Router()

listRouter.post('/create', authMiddleware, createListing)
listRouter.delete('/delete/:id', authMiddleware, deleteListing)

export default listRouter