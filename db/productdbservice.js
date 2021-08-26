const Product = require('../models/Product')
var mongoose = require('mongoose');
const e = require('express');

module.exports = {
    
    //ROUTES
    /**
     * 
     * @param {page number} page 
     * @param {limt of the result set to be displayed} limit 
     * @param {sort for the result set required} sort 
     * @returns an object containing previous, next, sort and results in the JSON object
     */
    getSomething: async function (page , limit, sort) {
            let sort_categories = ["Price Low-to-High", "Price High-to-Low"];
           
            page = parseInt(page)
            limit = parseInt(limit)

            const startIndex = (page - 1) * limit
            const endIndex = page * limit

            const results = {}

            if (endIndex < await Product.countDocuments().exec()) {
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
                    if(sort == sort_categories[0]){
                        results.results = await Product.find().limit(limit).skip(startIndex).sort({price: 1}).exec()
                    }else{
                        results.results = await Product.find().limit(limit).skip(startIndex).sort({price:  -1}).exec()
                    }
    
                    console.log(results)
                    return paginatedResults = results
                } catch (e) {
                    return ({ message: e.message })
                }
            // }
           
    },
    getAllMongooseProducts: async function (page) {

        let perpage = 2;
        //Decrement to set the correct starting index as the array index starts from 0 and the page number starts from 1
        page--;

        let totalPages = page || 1;

        await Product.find({ p_id: { $gte: 11 } }, {}, {}, async function (err, products) {
            try {
                if (err) {
                    console.log(err);
                }
                else {
                    let pages = products.length / perpage;
                    if (!Number.isInteger(pages))
                        pages = parseInt(pages) + 1;

                    totalPages = pages;
                }
            } catch (error) {
                console.log(error);
            }
        });

        console.log("Total Page Number is: " + totalPages);
        let search = {};
        // MyModel.find(query, fields, { skip: 10, limit: 5 }, function(err, results) { ... });

        await Product.find({ p_id: { $gte: 11 } }, {}, { skip: perpage * Number(page), limit: perpage }, async function (err, products) {
            try {
                if (err) {
                    console.log(err);
                }
                else {

                    if (products == null) {

                    }
                    search.p = products;
                    search.totalPages = totalPages;
                    search.currentPage = page + 1;
                    console.log(search)
                }
            } catch (error) {
                console.log(error);
            }
        });


    },

    getAllProducts: async function () {

        console.log(mongoose.connection.readyState + " fsdfsfdsfds Product service" + mongoose.connection.client)
        try {
            return (await Product.find());
        } catch (err) {
            return ({ message: err })
        }

    },

    getProductsForIndex: async function () {
        try {
            return (await Product.find({}, null, { limit: 3 }));
        } catch (error) {
            return ({ message: error })
        }
    },

    getKeywordProducts: async function (keyword) {
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