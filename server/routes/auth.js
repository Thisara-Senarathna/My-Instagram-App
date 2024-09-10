//routes.auth.js
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = require('../models/user')
const bcrypt= require('bcryptjs')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../keys')
const requireLogin = require('../middleware/requireLogin')
const { message } = require('antd')
const nodemailer = require('nodemailer')
const crypto = require('crypto')


const transporter = nodemailer.createTransport({
    host:"smtp.gmail.com",
    port:587,
    secure:false,
    auth:{
        user:"thisaratest01@gmail.com",
        pass:"tkne wffd bjda qhuo",
    }
})

router.post('/signup', async (req,res)=>{
    // console.log("data is coming...")
    const {name,email,password,profilePic} = req.body
    if(!name || !email || !password){
       return res.status(422).json({error:"Please add all fields"})
    }
    
    try {
        const savedUser = await User.findOne({ email: email })
        if (savedUser) {
            return res.status(422).json({ message: "user already exists" })
        }

        const hashPassword = await bcrypt.hash(password, 12)
        const user = new User({
            email,
            name,
            password: hashPassword,
            profilePic
        })

        // const token = crypto.randomBytes(32).toString('hex');
        const token = jwt.sign({email:email},JWT_SECRET);
        const expireDate = Date.now() + 3600000;

        user.emailVerificationToken = token;
        user.emailVerificationExpireDate = expireDate;
        await user.save()

        const verificationLink = `http://localhost:3000/emailverification/${token}`
        // console.log(user.email)
        const info = await transporter.sendMail({
            from: '"no-reply@" <thisaratest01@gmail.com>',
            to: user.email,
            subject: "email verification",
            html: `<h4>Click this <a href="${verificationLink}"> verification link </a> for verify your email address </h4>`,
        })

        // console.log("Message sent: %s", info.messageId)
        // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info))
        res.json({ message: "Check your email", user })
    } catch (err) {
        console.log(err)
        res.status(500).json({err});
    }
    
})

router.post('/signin',(req,res)=>{
    const {email,password} = req.body

    if(!email || !password){
        return res.status(422).json({message:"Please enter email and password"})
    }
    User.findOne({email:email})
    .then(savedUser => {
        if(!savedUser){
            return res.status(422).json({message:"Invalid email or password"})
        }
        if(!savedUser.is_verified){
            return res.status(422).json({message:"Email has not verified",state:"not_verified"})
        }
        bcrypt.compare(password,savedUser.password)
        .then(doMatch =>{
            if(doMatch){
                // res.json({message:"successfully signed in"})
                const {_id,name,email} = savedUser
                const token = jwt.sign({_id:savedUser._id},JWT_SECRET)
                res.json({token:token,User:{_id,name,email}})
            }
            else{
                return res.status(422).json({message:"Invalid email or password"})
            }
        })
        .catch(error =>{
            console.log(error)
        })
    })
    .catch(error => {
        console.log(error)
    })
})

router.post('/api/resetpassword', async(req,res)=>{
    try {
        const {email} = req.body;
        // console.log(email);
        const user = await User.findOne({email});
        if(!user){
            return res.status(422).json({message:"User not exists"});
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const expireTime = Date.now() + 3600000;

        user.resetPasswordToken = resetToken;
        user.expireDate = expireTime;

        await user.save();
        // console.log(user);

        const resetLink = `http://localhost:3000/newpassword/${resetToken}`

        const info = await transporter.sendMail({
            from:'"Instagram" <thisaratest01@gmail.com>',
            to:user.email,
            subject:"reset password",
            html:`<p>you requested a password reset</p>
                    <p>Click this <a href="${resetLink}"> link </a> to reset the password</P>`,
        });
        // console.log("Message sent: %s", info.messageId);
        res.json({message:"Check your email for a password reset link"});

    } catch (error) {
        res.status(500).json({error});
    }
})

router.post('/api/newpassword', async (req,res)=>{
    try {
        const {password,token} = req.body;
        const user = await User.findOne({resetPasswordToken:token, expireDate:{$gt:Date.now()}});
        if(!user){
            return res.status(422).json({message:"Try again sesson has expired"});
        }
        const hashPassword =await bcrypt.hash(password,12);

        user.password = hashPassword;      
        user.resetPasswordToken = undefined;
        user.expireDate = undefined;  
        await user.save();
        res.json({message:"password updated successfully"});
    } catch (error) {
        console.log("password not updated");
    }
})

router.post('/api/verifyemail', async (req,res)=>{
    try {
        
        const {token} = req.body;
        if(!token){
            return res.status(422).json({ message: "Token is required" });
        }
        let decoded;
        try {
            decoded= jwt.verify(token,JWT_SECRET);
        } catch (error) {   
            return res.status(422).json({ message: "Invalid or expired token" });
        }

        const {email} = decoded;

        const user = await User.findOne({email})
        if(!user){
            return res.status(422).json({message:"user not found"});
        }
        if(user.is_verified){
            return res.status(422).json({ message: "Email is already verified",state:"success"});
        }
        if(user.emailVerificationExpireDate < Date.now()){
            return res.status(422).json({ message: "Session has expired",state:"failed"});
        }
        
        user.is_verified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationExpireDate = undefined;
        await user.save();
        // console.log("verify success");
        res.json({message:"Email verified successfully"});
    } catch (error) {
        console.log(error);
    }
})


router.post('/api/resendverificationemail',async (req,res)=>{
    try {
        
        const {email} = req.body;
        // console.log(email);
        const user = await User.findOne({email}).select("-password");
        if(!user){
            return res.status(422).json({message:"user not found"});
        }
        if(user.is_verified){
            return res.status(422).json({ message: "Email is already verified",state:"success"});
        }

        const token = jwt.sign({email:email},JWT_SECRET);
        const expireDate = Date.now() + 3600000;

        user.emailVerificationToken = token;
        user.emailVerificationExpireDate = expireDate;
        await user.save()

        const verificationLink = `http://localhost:3000/emailverification/${token}`

        const info = await transporter.sendMail({
            from: '"no-reply@" <thisaratest01@gmail.com>',
            to: user.email,
            subject: "email verification",
            html: `<h4>Click this <a href="${verificationLink}"> verification link </a> for verify your email address </h4>`,
        })
        res.json({ message: "Check your email"})

    } catch (error) {
        
    }
})

module.exports = router