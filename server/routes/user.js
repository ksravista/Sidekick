const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');



router.post('/signup', async (req, res)=>{
   //check if userid and email exists
   let users = await User.find({ $or: [ { userId: req.body.userId }, { email: req.body.email } ] })
   if(users.length > 0){
      return res.status(400).send({err: 'Username or email already taken'});
   }else{
      let user = new User({
         _id: mongoose.Types.ObjectId(),
         userId: req.body.userId,
         email: req.body.email,
         password: req.body.password
     });

     user.password = await bcrypt.hash(user.password, 10);
     try{
         let result =  await user.save();
         res.status(200).send({message: `Username ${result.userId} created`});
      }catch(err){
         res.status(500).send(err);
      }
   }
});

router.post('/login', async (req, res) =>{

    let user = await User.find({email: req.body.email});
    res.status(200).send(user);

});

module.exports = router;