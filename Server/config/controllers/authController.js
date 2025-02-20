import User from "../models/userModel.js"
import bcrypt from 'bcrypt'

const signup = async (req,res) => {
    const {username, email, password} = req.body
    const hashedPassword = bcrypt.hashSync(password, 10)
    const newUser = new User({username, email, password: hashedPassword})

    try {
        await newUser.save()
        res.json({success:true, message:'User created successfully'}) 
    } catch (error) {
        res.json({success:false, message:'User Already exists'})
    }
    
}

export {signup}