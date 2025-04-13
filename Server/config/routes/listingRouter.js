import express from 'express'
import { createListing } from '../controllers/listingController.js'
import authMiddleware from '../../middleware/authmiddlerware.js'

const listRouter = express.Router()

listRouter.post('/create', authMiddleware, createListing)

export default listRouter