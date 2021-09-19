const mongoose = require('mongoose')

const FinalOrderSchema = mongoose.Schema({
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    cart : {
        type : Object,
        required : true
    },
    name : {
        type: String,
        required: true
    },
    email : {
        type: String,
        required: true
    },
    address : {
        type : String,
        required: true
    },
    city : {
        type: String,
        required: true
    },
    state : {
        type: String,
        required: true
    },
    zip : {
        type: String,
        required: true
    },
    paymentId:{
        type: String,
        required: true
    },
    status:{
        type: String,
        required: true
    },
    orderId:{
        type: String,
        required: true
    },
    created : {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('FinalOrder', FinalOrderSchema)