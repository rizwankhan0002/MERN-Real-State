import User from "../models/userModel.js"
import bcrypt from 'bcrypt'
import { errorHandler } from "../utils/error.js"

const signup = async(req, res, next) => {
    const {username, email, password} = req.body
    const hashedPassword = bcrypt.hashSync(password, 10)
    const newUser = new User({username, email, password: hashedPassword})

    try {
        await newUser.save()
        res.json({success:true, message:'User created successfully'}) 
    } catch (error) {
        next(error)
    }
    
}

export {signup}