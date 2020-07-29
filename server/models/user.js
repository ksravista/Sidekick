const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userId: String,
    title: String,
    body: String,
    likes: Number,
    comments: Number

});

module.exports = mongoose.model('User', userSchema);