const express = require('express');

const router = express.Router();

const Product = require('../models/Product')

//ROUTES
router.get('/', async (req, res)=>{
    // res.send('We are products')

    try{
        const posts = await Product.find();
        res.json(posts);
    }catch(err){
        res.json({message: err})
    }
})

router.post('/', async (req, res) => {

    console.log(req.body.img)

    const post = new Product({
        p_id: req.body.p_id,
        name: req.body.name,
        img: req.body.img,
        price: req.body.price//,
        // details: req.body.details
    })

    try {
        const savedProduct = await post.save();
        res.json(savedProduct);
    } catch (err) {
        res.json({ message: err })
    }

})

// router.get('/:p_id', async (req, res) => {

//     try{
//     const product = await Product.find({"p_id" : req.params.p_id})
//     res.json(product);
//     }catch(err){
//         res.json({message: err});
//     }
// })

module.exports = router;
