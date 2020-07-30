const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email:{
        type: String, 
        required: true
    } ,
    password: {
        type: String, 
        required: true
    },
    userId: {
        type: String, 
        required: true
    }
}, {
    versionKey: false
});

module.exports = mongoose.model('User', userSchema);