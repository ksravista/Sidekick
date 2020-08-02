const express = require('express');
const router = express.Router();
const Post = require('../models/post.model');
const mongoose = require('mongoose'); 
const tokenAuth = require('../middleware/token-auth');

router.get('/', async (req, res)=>{
    const posts = await Post.find({});
    try{
        res.status(200).send(posts);
    }catch(err){
        res.status(500).send(err);
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
        res.status(200).json({ 
            message: 'post has been posted'
    });
    }catch(err){
        res.status(500).send(err);
    }
});

module.exports = router;
