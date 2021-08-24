const mongoose = require('mongoose')

const ProductSchema = mongoose.Schema({
    p_id : {
        type: String,
        required: true
    },
    name : {
        type: String,
        required: true
    },
    img : {
        type: String,
        required: true
    },
    price : {
        type: String,
        required: true
    },
    detail : {
        type: Array,
    },
    created : {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Product', ProductSchema)