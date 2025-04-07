import jwt from 'jsonwebtoken'
import { errorHandler } from '../config/utils/error.js'

const authMiddleware = (req, res, next) => {
const token = req.cookies.access_token   // Get the token from the cookies

if (!token)
    return next(errorHandler(401, 'Not authenticated'))
try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) // verify token using secret key
    req.user = decoded   // Attach user information to the request object
    next()   // Proceed to the next middleware or route handler

} catch (error) {
    return next(errorHandler(401, 'Invalid or expired token'))
}
}
export default authMiddleware