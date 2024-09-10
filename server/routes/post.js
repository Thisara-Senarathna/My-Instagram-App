const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Post = require('../models/post')
const requireLogin = require('../middleware/requireLogin')
const { message } = require('antd')

router.post('/createpost',requireLogin,async (req,res)=>{
   
   try {
    const {title,body,pic} = req.body;
    console.log({title,body,pic});
    if(!title || !body || !pic){
        return  res.status(401).json({message:"Enter title and body field"})
    }

    req.user.password = undefined
    const post = new Post({
        title,
        body,
        photo:pic,
        postedBy:req.user
    })
    await post.save()
    console.log("success");
    res.json({message:"post created successfully"});

   } catch (error) {
        console.log(err);
        res.status(422).json({error});
   }
})

router.get('/api/allpost',async (req,res)=>{
    // console.log("check");
    try {
        const  posts = await Post.find({is_delete:false}).populate("postedBy","_id name").populate("comments.commentedBy","_id name").sort("-createdAt");
        // console.log(posts);

        const filteredPosts = posts.map(post=>{
            const filteredComments = post.comments.filter(comment=> !comment.is_delete);
            return {...post._doc,comments:filteredComments}
        });
        res.json({posts:filteredPosts});
    } catch (error) {
        console.log(error)
    }
    
})

router.get('/api/subscribedposts',requireLogin,async (req,res)=>{
    // console.log("check");
    try {
        const  posts = await Post.find({is_delete:false,postedBy:{$in:req.user.following}}).populate("postedBy","_id name").populate("comments.commentedBy","_id name").sort("-createdAt");
        // console.log(posts);

        const filteredPosts = posts.map(post=>{
            const filteredComments = post.comments.filter(comment=> !comment.is_delete);
            return {...post._doc,comments:filteredComments}
        });
        // console.log("subscribed post success");
        res.json({posts:filteredPosts});
    } catch (error) {
        console.log({error});
    }
    
})

router.get('/api/myposts/:id',requireLogin,(req,res)=>{
    // Post.find({postedBy:req.user._id}).populate("postedBy","_id name")
    const {id} = req.params;
    Post.find({postedBy:id})
    .then(myposts =>{
        res.json({myposts})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.put('/api/like',requireLogin, async (req,res)=>{
    const postId = req.body.postId;
    try {
        const result =await Post.findByIdAndUpdate(
            postId,
            {$push:{likes:req.user._id}},
            {new:true}
        );
        res.json(result)
    } catch (error) {
        console.log(error);
    }
})

router.put('/api/unlike',requireLogin, async (req,res)=>{
    const postId = req.body.postId;
    try {
        const result = await Post.findByIdAndUpdate(
            postId,
            {$pull:{likes:req.user._id}},
            {new:true}
        );
        res.json(result)
    } catch (error) {
        console.log(error);
    }

        
})


router.put('/api/comment',requireLogin,async (req,res)=>{
    const postId = req.body.postId;
    try {
        const cmt = {
            comment:req.body.comment,
            commentedBy:req.user._id,
        }
        const result = await Post.findByIdAndUpdate(
            postId,
            {$push:{comments:cmt}},
            {new:true}
        ).populate("comments.commentedBy","_id name");
        res.json(result)

    } catch (error) {
        console.log(error);
    }

})

router.put('/api/deletepost',requireLogin,async (req,res)=>{
    const postId = req.body.postId;
    // console.log(postId);
    // console.log(req.user._id);
    try {
        const post = await Post.findOne({_id:postId}).populate("postedBy","_id");
        if(!post || post.is_delete == true){
            return res.status(422).json({message:"Post does not exist or is already deleted"})
        }
        if(post && post.postedBy._id.equals(req.user._id)){
            post.is_delete = true;
            await post.save();
            // console.log("post is deleted")
            res.json({ message: "Post updated successfully", post });
        }else{
            console.log("post is not deleted");
        }
    } catch (error) {
        console.log(error);
    }
})


router.put('/api/deletecomment',requireLogin, async (req,res)=>{
    const postId = req.body.postId;
    const commentId = req.body.commentId;
    try {

        const post = await Post.findById({_id:postId}).populate("comments.commentedBy","_id");
        if(!post){
            return res.status(404).json({message:"post not found"});
        }

        const comment = post.comments.find(comment=>comment._id.toString() === commentId);

        if(!comment){
            return res.status(404).json({message:"commment not found"});
        }
        if(!comment.commentedBy || comment.commentedBy._id.toString() !== req.user._id.toString()){
            return res.status(401).json({message:"unauthorized"});
        }

        comment.is_delete=true;
        await post.save();
        // console.log("success delete");
        return res.json({post});
    } catch (error) {
        // return res.status(422).json({error:error});
        console.log(error);
    }
})

module.exports = router
