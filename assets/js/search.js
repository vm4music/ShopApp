const fetch = require('node-fetch');
// const mongoose = require('mongoose');
// const Product = require('./models/Product')
let sort_categories = ["Price Low-to-High", "Price High-to-Low"];
let product_categories = ["Age 1-3", "Age 4-6", "Age 7-13", "Age 14+", "Educational Toys"];
module.exports = {

    searchProductsByCategories2: function (products, startIndex, endIndex, keywords, sort_selected, page, qry, limit) {
        let search = {};
        try {
            let arr = (keywords !="") ? products.result.filter(item => item.categories.includes(keywords)) : products;
            // console.log(req.user);
            let pages = arr.length / limit;
            if (!Number.isInteger(pages))
                pages = parseInt(pages) + 1;

            if (sort_selected) {
                switch (sort_selected) {
                    case sort_categories[0]:
                        search.result = arr.sort(function (a, b) { return a.price - b.price });
                        break;
                    case sort_categories[1]:
                        search.result = arr.sort(function (a, b) { return b.price - a.price });
                        break;
                    default:
                        search.result = arr;
                        break;
                }
            }

            search.result = arr.slice(startIndex, endIndex);

            search.category_selected = keywords != "" ? keywords : "none";
            search.product_categories = product_categories;
            search.sort_categories = sort_categories;
            search.page_selected = page;
            search.qry = keywords || "Age 1-3"; // Age 1-3 is added to make sure that the category is passed while accessing the shop link
            search.pages = pages;
            search.sort_selected = sort_selected != "" ? sort_selected : "none";

            // console.log(search);
        } catch (error) {
            console.log('system error')
        }
        console.log(JSON.stringify(search))
        return JSON.stringify(search);
    },

    searchProductsByCategories: function (products, startIndex, endIndex, keywords, sort_selected, page, qry, limit) {
        // mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, () => console.log("test DB"));
        // try {
        //     usersL = await User.find();
        // } catch (e) {
        //     console.log({ message: e })
        // }

        let search = {};
        try {
            let arr = (keywords !="") ? products.filter(item => item.categories.includes(keywords)) : products;
            // console.log(req.user);
            let pages = arr.length / limit;
            if (!Number.isInteger(pages))
                pages = parseInt(pages) + 1;

            if (sort_selected) {
                switch (sort_selected) {
                    case sort_categories[0]:
                        search.result = arr.sort(function (a, b) { return a.price - b.price });
                        break;
                    case sort_categories[1]:
                        search.result = arr.sort(function (a, b) { return b.price - a.price });
                        break;
                    default:
                        search.result = arr;
                        break;
                }
            }

            search.result = arr.slice(startIndex, endIndex);

            search.category_selected = keywords != "" ? keywords : "none";
            search.product_categories = product_categories;
            search.sort_categories = sort_categories;
            search.page_selected = page;
            search.qry = keywords || "Age 1-3"; // Age 1-3 is added to make sure that the category is passed while accessing the shop link
            search.pages = pages;
            search.sort_selected = sort_selected != "" ? sort_selected : "none";

            // console.log(search);
        } catch (error) {
            console.log('system error')
        }
        console.log(JSON.stringify(search))
        return JSON.stringify(search);
    },

    searchProductsByKeyword: function (products, startIndex, endIndex, keywords, product_categories, sort_categories, page, qry, pages) {
        let search = {};

        let arr = (keywords) ? products.filter(item => item.name.includes(keywords)) : products;
        arr = arr.slice(startIndex, endIndex);

        search.category_selected = keywords != "" ? keywords : "none";
        search.product_categories = product_categories;
        search.sort_categories = sort_categories;
        search.page_selected = page;
        search.result = arr;
        search.qry = keywords;
        search.pages = pages;

        return JSON.stringify(search);
    },

    getProducts: async function () {

        let response = await fetch('https://maindbservice.herokuapp.com/products', {
            method: 'get',
            headers: {
                // 'Authorization': 'Basic ' + btoa('app.user' + ':' + 'Servicenow"123!'),
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            mode: 'CORS',
            cache: 'default'
        });
        let data = (response.json());
        // return response.json();
        return data;
    }
};
// Add the logic to show the recently seen products on the carousel on home page.