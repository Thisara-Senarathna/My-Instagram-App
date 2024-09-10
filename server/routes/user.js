const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = require('../models/user')
const Post = require('../models/post')
const requireLogin = require('../middleware/requireLogin')


// router.get('/getuser/:id',(req,res)=>{
//     const {id} = req.params
//     // console.log("user detail is getting, id:",id)
//     User.findById(id).select('_id name email')
//     .then(data=>{
//         console.log(data)
//         if(!data){
//             return res.status(404).json({message:"user not found"})
//         }
//         res.json({data})
//     })
//     .catch(err=>{
//         console.log(err)
//     })
// })

router.get('/api/user/:id' ,requireLogin, async (req,res)=>{
    try {
        const userId = req.params.id;
        const user = await User.findById(userId).select("-password");
        if(user){
            const posts = await Post.find({postedBy:userId}).populate("postedBy","_id name");
            res.json({user,posts});
        }
        else{
            return res.status(404).json({message:"user not found"})
        }    
    } catch (error) {
        console.log(error);
    }

})

router.put('/api/follow',requireLogin,async(req,res) =>{
    const followId = req.body.followId;
    // console.log(followId);
    try {
        const follower = await User.findByIdAndUpdate(
            followId,
            {$push:{followers:req.user._id}},
            {new:true}
        )

        const following = await User.findByIdAndUpdate(
            req.user._id,
            {$push:{following:followId}},
            {new:true}
        )
        // console.log("follow is success");
        res.json({follower,following});
    } catch (error) {
        console.log(error);
    }
})

router.put('/api/unfollow',requireLogin, async(req,res) =>{
    const followId = req.body.followId;
    try {
        const follower = await User.findByIdAndUpdate(
            followId,
            {$pull:{followers:req.user._id}},
            {new:true}
        )

        const following = await User.findByIdAndUpdate(
            req.user._id,
            {$pull:{following:followId}},
            {new:true}
        )
        // console.log("unfollow is success");
        res.json({follower,following});
    } catch (error) {
        console.log(error);
    }
})

router.put('/api/updateprfilepic',requireLogin, async (req,res)=>{
    try {
        const profilePic = req.body.profilePic;
        // console.log(profilePic);
        if(profilePic){
            const result = await User.findByIdAndUpdate(
                req.user._id,
                {profilePic:profilePic},
                {new:true}
            );
            if (!result) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json(result);
        }
    } catch (error) {
        console.log({error});
    }
})


router.post('/api/searchuser', async (req,res)=>{
    const searchTerm = req.body.searchTerm;
    // console.log(searchTerm);
    if(searchTerm){
        try {
        
            let pattern = new RegExp("^"+searchTerm,'i');
            const result = await User.find({name:{$regex:pattern}}).select("_id name email");
            // console.log("result:",result);
            res.json(result);
        } catch (error) {
            console.log({error});
            res.status(422).json({error});
        }
    }else{
        // console.log("no word to search");
        res.json([]);
    }
})

module.exports = router