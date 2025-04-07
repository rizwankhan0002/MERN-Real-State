import User from "../models/userModel.js"
import { errorHandler } from "../utils/error.js"

// Update the profile API - PUT method
const updateProfile = async (req, res, next) => {
const userId = req.user.id
const { username, email, password, avatar } = req.body

try {
    // Find the user by their ID and update their profile 
    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { username, email, password, avatar }, // Fields to update
        { new: true }  // Return the udpated document
    )
    if (!updatedUser)
        return next(errorHandler(400, 'User not found'))   //Error if user not found
    // Send back the updated user data
    res.status(200).json({success: true, message:'Profile Updated Successfully', user: updatedUser})

} catch (error) {
    next(error)
}
}

const getProfile = async (req, res, next) => {
  const userId = req.user.id
  try {
    // Find the user by ID and return their data
    const user = await User.findById(userId).select('-password')
    if (!user) {
        return 
        next(errorHandler(400, 'User not found'))
    }
    res.status(200).json({success: true, user})
  } catch (error) {
    next(error)
  }
}
const test = (req,res) => {
res.json({
    message:'API WORKING'
})
}
export {test, updateProfile, getProfile}
