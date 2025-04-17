import express from 'express'
import { createListing, deleteListing, updateListing } from '../controllers/listingController.js'
import authMiddleware from '../../middleware/authmiddlerware.js'

const listRouter = express.Router()

listRouter.post('/create', authMiddleware, createListing)
listRouter.delete('/delete/:id', authMiddleware, deleteListing)
listRouter.post('/update/:id', authMiddleware, updateListing)

export default listRouter