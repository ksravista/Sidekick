const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userId: String,
    title: String,
    body: String,
    likes: Number,
    comments: Number

}, {
    versionKey: false
});

module.exports = mongoose.model('Post', postSchema);