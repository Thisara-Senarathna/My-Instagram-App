const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    emailVerificationToken : {type:String},
    emailVerificationExpireDate:{type:Date},

    resetPasswordToken:{type:String},
    expireDate:{type:Date},

    is_verified:{
        type:Boolean,
        default:false
    },

    profilePic:{
        type:String,
        default:"https://res.cloudinary.com/kvtas/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1720936090/no_pro_pic_2_dc9nhp.png"
    },
    followers:[{type:Object,ref:"User"}],
    following:[{type:Object,ref:"User"}],
},{timestamps:true})

const User = mongoose.model("User", userSchema)
module.exports = User;