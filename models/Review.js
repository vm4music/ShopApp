const mongoose = require('mongoose')

const ReviewSchema = mongoose.Schema({
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    username : {
        type : String
    },
    product : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Product'
    },
    review_detail : {
        type : Array
    }


})

module.exports = mongoose.model('Review', ReviewSchema)