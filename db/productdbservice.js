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
     * @returns an object containing previous, next, sort and results in the JSON object
     */
    getSomething: async function (page, limit, sort, text) {
        let find_query = {};
        let s_text = '';

        if(text.category){
            find_query = { categories: text.category };
            s_text = text.category;
        }
           
        if(text.key){
            find_query = { $text: { $search: text.key } };
            s_text = text.key;
        }
            

            console.log(find_query)
        let sort_categories = ["Price Low-to-High", "Price High-to-Low"];3

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


        // if(sort){
        results.sort = sort;

        try {
            if (sort == sort_categories[0]) {
                results.results = await Product.find(find_query).limit(limit).skip(startIndex).sort({ price: 1 }).exec()
            } else {
                results.results = await Product.find(find_query).limit(limit).skip(startIndex).sort({ price: -1 }).exec()
            }
            results.text = text;
            console.log(results)
            return paginatedResults = results
        } catch (e) {
            return ({ message: e.message })
        }
        // }

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


    // getAllProducts: async function () {

    //     console.log(mongoose.connection.readyState + " fsdfsfdsfds Product service" + mongoose.connection.client)
    //     try {
    //         return (await Product.find());
    //     } catch (err) {
    //         return ({ message: err })
    //     }

    // },

    

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