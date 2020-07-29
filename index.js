
const express = require('express');
const config = require('./config');
const app = express();
app.use(express.json());

const Post = require('./models/post');
const User = require('./models/user');

const PORT = config.PORT || 5000;
const mongoose = require('mongoose'); 



mongoose.connect(config.MONGO_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true
})

mongoose.connection.on('connected', () => {
    console.log('mongo connected');
})


app.get('/posts', async (req, res)=>{
    const posts = await User.find({});
    try{
        res.status(200).send(posts);
    }catch(err){
        res.status(500).send(err);
    }
});

app.post('/post', (req, res) =>{
    const post = new Post({
        userId
    });
});


app.listen(PORT, () =>
  console.log(`Example app listening on port ${PORT}!`),
);
