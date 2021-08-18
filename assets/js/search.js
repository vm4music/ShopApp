const fetch = require('node-fetch');
module.exports = {

    searchProducts: function (products, startIndex, endIndex, keywords, product_categories, sort_categories, page, qry, pages) {
        let search = {};

        let arr = (keywords) ? products.filter(item => item.categories.includes(keywords)) : products;
        arr = arr.slice(startIndex, endIndex);

        search.category_selected = keywords != "" ? keywords : "none";
        search.product_categories = product_categories;
        search.sort_categories = sort_categories;
        search.page_selected = page;
        search.result = arr;
        search.qry = "";
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