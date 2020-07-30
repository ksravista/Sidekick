const express = require('express');
const router = express.Router();
const Post = require('../models/post.model');
const mongoose = require('mongoose'); 


router.get('/', async (req, res)=>{
    const posts = await Post.find({});
    try{
        res.status(200).send(posts);
    }catch(err){
        res.status(500).send(err);
    }
});

router.post('/post', async(req, res) =>{
    const post = new Post({
        _id: mongoose.Types.ObjectId(),
        userId: req.body.userId,
        title: req.body.title,
        body: req.body.body,
        likes: 0,
        comments: 0
    });

    try{
        const result = await post.save();
        res.status(200).send(result);
    }catch(err){
        res.status(500).send(err);
    }
});

module.exports = router;
