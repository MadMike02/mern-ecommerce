import Jwt from "jsonwebtoken";
import User from "../models/UserModel.js";
import asyncHandler from "express-async-handler";

const protect = asyncHandler(async (req, res, next) => {
    let token
    // console.log(req.headers)
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
    {
        try{
            token = req.headers.authorization.split(' ')[1]
            const decode = Jwt.verify(token, process.env.JWT_SECRET)
            
            
            req.user = await User.findById(decode.id).select('-password')
        }
        catch(error){
            console.error(error)
            res.status(401)
            throw new Error('Not authorized')
        }
    }   

    
    next()
})

const admin = (req,res,next)=>{
    // console.log(req.user)
    if(req.user && req.user.isAdmin){
        next()
    }
    else
    {
        res.status(401)
        throw new Error('Not authroized as admin')
    }
}
export {protect,admin}