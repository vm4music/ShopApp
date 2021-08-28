const mongoose = require('mongoose')
const Product = require('../models/Product')

const OrderSchema = mongoose.Schema({
    user : {
        type: String,
        required: true
    },
    items : {
        type : Object,
        required : true
    },
    totalQty : {
        type: Number,
        required: true
    },
    totalPrice : {
        type: Number,
        required: true
    },
    tax : {
        type: Number,
        required: true
    },
    shipping: {
        type : Number,
        required: true
    },
    grandTotal : {
        type : Number,
        required : true
    },
    isCompleted : {
        type : Boolean,
        required: true
    },
    created : {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Order', OrderSchema)