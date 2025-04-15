import Listing from "../models/listingModel.js"
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

const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, 'You can only delete your own account!'))
  try {
    await User.findByIdAndDelete(req.params.id)
    res.status(200).json('User has been deleted')
  } catch (error) {
    next(error)
  }
}

const getUserListings = async (req, res, next) => {
if (req.user.id === req.params.id) {
   try {
    const listings = await Listing.find({ userRef: req.params.id })
    res.status(200).json(listings)
   } catch (error) {
    next(error)
   }
} else {
  return next(errorHandler(401, 'You can only view your own listings!'))
}
}




const test = (req,res) => {
res.json({
    message:'API WORKING'
})
}
export {test, updateProfile, getProfile, deleteUser, getUserListings}
