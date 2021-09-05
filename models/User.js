const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    username : {
        type: String,
        unique: true,
        required: true
    },
    password : {
        type: String
        // required: true
    },
    email : {
        type: String,
        unique : true
        // required: true
    },
    wishlist : {
        type : Array
    },
    googleId : {
        type : String
    },
    created : {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('User', UserSchema)