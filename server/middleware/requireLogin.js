const jwt = require("jsonwebtoken")
const {JWT_SECRET} = require('../keys')
const mongoose = require('mongoose')
const User = require('../models/user')

module.exports = (req,res,next) =>{
    const authHeader= req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if(!authHeader){
        return res.status(401).json({message:"you must be logged in"})
    }
    // console.log("token",token)
    jwt.verify(token,JWT_SECRET,(error,payload) =>{
        if(error){
            return res.status(401).json({message:"you must be logged in"})
        }

        const {_id} = payload
        User.findById(_id).then(userdata =>{
            req.user = userdata
            // console.log(req.user.name)
            next();
        })
        
    })
}