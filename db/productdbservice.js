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
    },

    getKeywordProducts : async function(keyword){
        const rgx = (pattern) => new RegExp(`.*${pattern}.*`);
        const searchRgx = rgx(keyword);
        // const userRegex = new RegExp(keyword, 'i')
        let logg = await Product.find(
            { 
                 name: { $regex: searchRgx, $options: "i" } 
            }
        );

            console.log(logg)
            return logg;
            // let logg = await Product.find({ name: { $regex: keyword, $options: "i" } }, function(err, docs) {
            //     console.log("Partial Search Begins");
            //     console.log(docs);
            //     });
            //{ $regex: keyword, $options: "i" }
        // var result = db.collection('AdSchema').find({
        //     $or: [ {vehicleDescription : { $regex: search.keyWord, $options: 'i' }}, { adDescription: { $regex: search.keyWord, $options: 'i' } } ]
        // });
    }
};
// Add the logic to show the recently seen products on the carousel on home page.