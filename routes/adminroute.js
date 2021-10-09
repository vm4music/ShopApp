const express = require('express');
const Product = require('../models/Product')
const router = express.Router();
const mongoose = require('mongoose');

router.get('/products', connectMongoose, async (req, res) => {
    var products = await Product.find({});

   
    res.render('adminproducts', {
        title: 'Product List',
        data: products,
        user: req.user || ""
    });
    
})

router.get('/products/:id', connectMongoose, async (req, res) => {

    var product__ID = req.params.id
    
    var product = await Product.findOne({p_id : product__ID})

    res.render('adminproductpage', {
        title: 'Product List',
        data: product,
        user: req.user || ""
    });
    
})

function connectMongoose(req, res, next) {
    if (mongoose.connection.readyState < 1)
        mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, () => console.log("test DB"));
    next()
}


module.exports = router;