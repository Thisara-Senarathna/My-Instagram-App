const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const postSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    },
    photo:{
        type:String,
        required:true
    },
    likes:[{type:ObjectId,ref:"User"}],
    comments:[{
        comment:String,
        commentedBy:{type:ObjectId,ref:"User"},
        is_delete:{type:Boolean,default:false}
    }],
    postedBy:{
        type:ObjectId,
        ref:"User"
    },
    is_delete:{
        type:Boolean,
        default:"false"
    }
},{timestamps:true})  


const Post = mongoose.model("Post",postSchema)
module.exports = Post