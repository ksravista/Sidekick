const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config');
const multer = require('multer');
const aws = require('aws-sdk');
const uuid = require('uuid');
const tokenAuth = require('../middleware/token-auth');

//TODO: get all current user data. this includes likes and comments.
//credentials + likes
//add bio, website.
//like a post

const s3 = new aws.S3({
   accessKeyId: config.AWS.AWS_ACCESS_KEY_ID,
   secretAccessKey: config.AWS.SECRET_ACCESS_KEY
});

const storage = multer.memoryStorage({
   destination: (req, file, callback)=>{
      callback(null, '');
   }
});

const upload = multer({storage});

//JWT authentication, multer middleware.
router.post('/image', tokenAuth, upload.single('image'), (req, res)=>{

   console.log(req.file);
   let fileName = req.file.originalname.split('.');
   //eg. .png or .jpeg
   const fileType = fileName[fileName.length - 1];

   if(fileType !== 'jpeg' && fileType !== 'png' && fileType !== 'jpg'){
      res.status(400).send({error: 'only picture files allowed'});
   }
   else{
      const params = {
         Bucket: config.AWS.BUCKET_NAME,
         Key: `${uuid.v4()}.${fileType}`,
         Body: req.file.buffer
      };

      s3.upload(params, (err, data) => {
         if(err){
            res.status(500).json({message: 'error uploading file'});
         }
         else{
            res.status(201).json({
               message: 'image uploaded sucessfully', data});
         }
      });
   }
})
router.post('/signup', async (req, res)=>{
   
   //TODO
   //make sure email, password and username are given

   //check if userid and email exists
   let users = await User.find({ $or: [ { userId: req.body.userId }, { email: req.body.email } ] })
   if(users.length > 0){
      return res.status(400).send({err: 'Username or email already taken'});
   }else{
      let user = new User({
         _id: mongoose.Types.ObjectId(),
         userId: req.body.userId,
         email: req.body.email,
         password: req.body.password,
         profilePic: req.body.profilePic
     });

     try{
         user.password = await bcrypt.hash(user.password, 10);
         let result =  await user.save(); //saving to mongo
         let token = jwt.sign(
            {
               //payload
               email: user.email,
               userId: user.userId
            },
            config.JWT_SECRET,
            {
               expiresIn: "1hr"
            }
         );
         res.status(200).json({
            message: `Username ${result.userId} created`,
            username: result.userId,
            token
         });
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
                  //payload
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

    
});

module.exports = router;