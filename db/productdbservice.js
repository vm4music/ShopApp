const Product = require('../models/Product')

module.exports = {

        //ROUTES
    getAllProducts: async function () {

        console.log('We are products DB')
        try {
            return (await Product.find());
        } catch (err) {
            return ({ message: err })
        }
        
    }
};
// Add the logic to show the recently seen products on the carousel on home page.