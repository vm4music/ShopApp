const Product = require('../models/Product')
var mongoose = require('mongoose');
const e = require('express');
const { find } = require('../models/Product');

module.exports = {

    //ROUTES
    getProductsForIndex: async function () {
        try {
            return (await Product.find({}, null, { limit: 3 }));
        } catch (error) {
            return ({ message: error })
        }
    },

    /**
     * 
     * @param {page number} page 
     * @param {limt of the result set to be displayed} limit 
     * @param {sort for the result set required} sort 
     * @param {keyowrd or the category of the products to be displayed on the page} text
     * @returns an object containing previous, next, sort and results in the JSON object
     * results.next [Page number and limit of the next set of records]
     * restuls.previous [Page number and limit of the previous set of records]
     * results.sort [Sort applied to the current set of records being queried]
     * results.sort_text [keyword or the category for which the list of products need to be returned]
     * results.results [Array of Products] 
     */    
    getProductsWithPage: async function (page, limit, sort, text) {
        let find_query = {};
        let s_text = '';

        if(text.category != ""){
            find_query = { categories: text.category };
            s_text = text.category;
        }
           
        if(text.key != ""){
            find_query = { $text: { $search: text.key } };
            s_text = text.key;
        }
        
        console.log(find_query)
        let sort_categories = ["Price Low-to-High", "Price High-to-Low"];

        page = parseInt(page)
        limit = parseInt(limit)

        const startIndex = (page - 1) * limit
        const endIndex = page * limit

        const results = {}

        if (endIndex < await Product.countDocuments(find_query).exec()) {
            results.next = {
                page: page + 1,
                limit: limit
            }
        }
        if (startIndex > 0) {
            results.previous = {
                page: page - 1,
                limit: limit
            }
        }

        console.log( await Product.countDocuments(find_query).exec())
        results.sort = sort;
        results.sort_text = s_text

        try {
            if (sort == sort_categories[0]) {
                results.results = await Product.find(find_query).limit(limit).skip(startIndex).sort({ price: 1 }).exec()
            } else {
                results.results = await Product.find(find_query).limit(limit).skip(startIndex).sort({ price: -1 }).exec()
            }
            results.text = text;
            // console.log(results.results)
            return paginatedResults = results
        } catch (e) {
            return ({ message: e.message })
        }

    },

    getWishlist: async function (page, limit, sort, text) {
        let find_query = {};
        let s_text = '';

        if(text.category != ""){
            s_text = text.category;
        }
           
        if(text.key != ""){
            s_text = text.key;
        }
        let sort_categories = ["Price Low-to-High", "Price High-to-Low"];

        page = parseInt(page)
        limit = parseInt(limit)

        const startIndex = (page - 1) * limit
        const endIndex = page * limit

        const results = {}

        if (endIndex < await Product.countDocuments({p_id: { $in: text.wishlist }}).exec()) {
            results.next = {
                page: page + 1,
                limit: limit
            }
        }
        if (startIndex > 0) {
            results.previous = {
                page: page - 1,
                limit: limit
            }
        }

        results.sort = sort;
        results.sort_text = s_text

        try {
            if (sort == sort_categories[0]) {
                results.results = await Product.find({p_id: { $in: text.wishlist }}).limit(limit).skip(startIndex).sort({ price: 1 }).exec();
            } else {
                results.results = await Product.find({p_id: { $in: text.wishlist }}).limit(limit).skip(startIndex).sort({ price: -1 }).exec()
            }
            results.text = text;
            // console.log(results.results)
            return paginatedResults = results
        } catch (e) {
            return ({ message: e.message })
        }

    },

    // getProductsByCategory: async function (page, limit, sort, text) {
        
    //     let find_query = (text) ? { categories: text } : {};
    //     let sort_categories = ["Price Low-to-High", "Price High-to-Low"];

    //     page = parseInt(page)
    //     limit = parseInt(limit)

    //     const startIndex = (page - 1) * limit
    //     const endIndex = page * limit

    //     const results = {}

    //     if (endIndex < await Product.countDocuments(find_query).exec()) {
    //         results.next = {
    //             page: page + 1,
    //             limit: limit
    //         }
    //     }
    //     if (startIndex > 0) {
    //         results.previous = {
    //             page: page - 1,
    //             limit: limit
    //         }
    //     }


    //     // if(sort){
    //     results.sort = sort;

    //     try {
    //         if (sort == sort_categories[0]) {
    //             results.results = await Product.find(find_query).limit(limit).skip(startIndex).sort({ price: 1 }).exec()
    //         } else {
    //             results.results = await Product.find(find_query).limit(limit).skip(startIndex).sort({ price: -1 }).exec()
    //         }
    //         results.text = text;
    //         console.log(results)
    //         return paginatedResults = results
    //     } catch (e) {
    //         return ({ message: e.message })
    //     }
    //     // }

    // },


    getAllProducts: async function () {

        console.log(mongoose.connection.readyState + " fsdfsfdsfds Product service" + mongoose.connection.client)
        try {
            return (await Product.find());
        } catch (err) {
            return ({ message: err })
        }

    },

    

    // getKeywordProducts: async function (keyword) {
    //     try {

    //         results = await Product.find({ $text: { $search: "suspension truck" } })

    //         console.log(results)
    //         return paginatedResults = results
    //     } catch (e) {
    //         return ({ message: e.message })
    //     }
    // }
};
// Add the logic to show the recently seen products on the carousel on home page.