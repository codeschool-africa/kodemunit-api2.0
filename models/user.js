const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required:true
    },
    secondname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique:true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    },
    confirmed: { type: Boolean, default: false },
    date: {
        type: Date,
        default:Date.now
    }
})

module.exports = User = mongoose.model('user', UserSchema);