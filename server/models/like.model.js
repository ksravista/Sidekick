const mongoose = require('mongoose');

const likeSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userId: {
        type: String,
        required: true
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
    
}, {
    versionKey: false,
    strict: false
});

 likeSchema.index({userId:1, postId:1}, { unique: true });

module.exports = mongoose.model('Like', likeSchema);