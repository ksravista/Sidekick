const express = require('express');
const mongoose = require('mongoose'); 
const config = require('./config');
const app = express();
app.use(express.json());

const postRoutes = require('./routes/post');
const userRoutes = require('./routes/user');

app.use('/posts', postRoutes);
app.use('/user', userRoutes);
const PORT = config.PORT || 5000;

mongoose.connect(config.MONGO_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
    console.log('mongo connected');
});
app.listen(PORT, () =>
  console.log(`App listening on port ${PORT}!`),
);
