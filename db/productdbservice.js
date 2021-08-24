const Product = require('../models/Product')
var mongoose = require('mongoose');

module.exports = {

        //ROUTES
    getAllProducts: async function () {

        console.log(mongoose.connection.readyState+ " fsdfsfdsfds Product service" +  mongoose.connection.client)
        try {
            return (await Product.find());
        } catch (err) {
            return ({ message: err })
        }
        
    },

    getProductsForIndex : async function() {
        try {
            return (await Product.find({}, null, { limit: 3 }));
        } catch (error) {
            return ({ message: error })
        }
    }
};
// Add the logic to show the recently seen products on the carousel on home page.