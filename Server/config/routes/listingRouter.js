import express from 'express'
import { createListing, deleteListing, getListing, getlistings, updateListing } from '../controllers/listingController.js'
import authMiddleware from '../../middleware/authmiddlerware.js'

const listRouter = express.Router()

listRouter.post('/create', authMiddleware, createListing)
listRouter.delete('/delete/:id', authMiddleware, deleteListing)
listRouter.post('/update/:id', authMiddleware, updateListing)
listRouter.get('/get/:id', getListing)
listRouter.get('/get', getlistings)

export default listRouter