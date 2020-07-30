const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userId: {
        type: String, 
        required: true
    },
    title: {
        type: String, 
        required: true
    },
    body: String,
    likes: Number,
    comments: Number

}, {
    versionKey: false
});

module.exports = mongoose.model('Post', postSchema);