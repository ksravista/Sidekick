const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config');



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

     try{
         user.password = await bcrypt.hash(user.password, 10);
         let result =  await user.save();
         res.status(200).json({message: `Username ${result.userId} created`});
      }catch(err){
         res.status(500).send(err);
      }
   }
});

router.post('/login', async (req, res) =>{

    let user = await User.findOne({userId: req.body.userId});
    console.log(user);

    if(!user){
      res.status(401).json({err: "Auth failed"});
    }
    else{

       try{
         let match = await bcrypt.compare(req.body.password, user.password);
         if(match){
            let token = jwt.sign(
               {
                  email: user.email,
                  userId: user.userId
               },
               config.JWT_SECRET,
               {
                  expiresIn: "1hr"
               }
            );
            res.status(200).json({
               message: "Auth successful",
               token: token
            });
          }else{
            res.status(401).json({err: "Auth failed"});
          }
       }catch(err){
         res.status(500).json({err});
       } 

       
    }

    res.status(200).send(user);

});

module.exports = router;