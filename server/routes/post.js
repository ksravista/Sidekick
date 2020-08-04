const express = require('express');
const router = express.Router();
const Post = require('../models/post.model');
const Like = require('../models/like.model');
const mongoose = require('mongoose'); 
const tokenAuth = require('../middleware/token-auth');

router.post('/unlike/:postId', tokenAuth, async (req, res) => {


    let delDoc = {
        userId: req.userData.userId, 
        postId: req.params.postId
    }

    try{
        //delete like document
        await Like.deleteOne(delDoc);

        //update likes on post 
        await Post.updateOne({_id: delDoc.postId, likes: {$gt:0}}, { $inc: { likes: -1 }});        
        return res.status(200).json({message: 'unliked successfully'});
    }catch(err){
        return res.status(500).json(err);
    }

});

router.post('/like/:postId', tokenAuth, async (req,res) => {

    const likeDoc = new Like ({
        _id: mongoose.Types.ObjectId(),
        userId: req.userData.userId,
        postId: req.params.postId
    });

    try{
        //add like document
        await likeDoc.save();

        //update likes on post 
        await Post.findOneAndUpdate({_id: req.params.postId}, { $inc: { likes: 1 }});
        return res.status(200).json({message: 'liked successfully'});
    }catch(err){
        if(err.code === 11000){
            return res.status(400).json({err: "Already liked post"});
        }
        return res.status(500).json(err);
    }
});

router.get('/', async (req, res)=>{
    const posts = await Post.find({});
    try{
        return res.status(200).json(posts);
    }catch(err){
        return res.status(500).json(err);
    }
});

router.post('/post',tokenAuth, async(req, res) =>{
    const post = new Post({
        _id: mongoose.Types.ObjectId(),
        userId: req.userData.userId,
        title: req.body.title,
        body: req.body.body,
        likes: 0,
        comments: 0
    });

    try{
        const result = await post.save();
         return res.status(201).json({message: 'post has been posted'});
    }catch(err){
        return res.status(500).json(err);
    }
});

module.exports = router;
