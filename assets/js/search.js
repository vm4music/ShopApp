const fetch = require('node-fetch');
let sort_categories = ["Price Low-to-High", "Price High-to-Low"];
let product_categories = ["Age 1-3", "Age 4-6", "Age 7-13", "Age 14+", "Educational Toys"];
module.exports = {

    searchProductsByCategories: function (products, startIndex, endIndex, keywords, sort_selected, page, qry, pages) {
        let search = {};

        let arr = (keywords) ? products.filter(item => item.categories.includes(keywords)) : products;
        

        if(sort_selected){
            switch(sort_selected){
                case sort_categories[0]:
                    search.result = arr.sort(function(a, b){return a.price - b.price});
                    break;
                case sort_categories[1]:
                    search.result = arr.sort(function(a, b){return b.price - a.price});
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
        search.qry = keywords;
        search.pages = pages;
        search.sort_selected = sort_selected!=""?sort_selected:"none"; 


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
        let data =  (response.json());
        // return response.json();
        return data;
    }
};
// Add the logic to show the recently seen products on the carousel on home page.