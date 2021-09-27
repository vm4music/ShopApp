const express = require('express');

const router = express.Router();

const Product = require('../models/Product')


//ROUTES
router.get('/', async (req, res)=>{
    // res.send('We are products')

    try{
        const posts = await Product.find();

        //res.json(posts);
        res.render('productlistadmin', {
            title: 'List View',
            data: posts,
            user: req.user || ""
        });
    }catch(err){
        res.json({message: err})
    }
})

router.post('/', async (req, res) => {

    const post = new Product({
        p_id: req.body.p_id,
        name: req.body.name,
        img: req.body.img,
        price: req.body.price,
        detail: req.body.details
    })

    try {
        const savedProduct = await post.save();
        res.json(savedProduct);
    } catch (err) {
        res.json({ message: err })
    }

})

router.get('/shop2', async (req, res) => {
    let list = {};
    list.qry = "Welcome to shop";
    // let page = Math.max(0, req.query.page) || 1;
    try {
        // let key = req.query.text; // this is to get the keywords from the searchbar
        // let page = req.query.page || 1;
        // let sort = req.query.sort || "Price High-to-Low";

        res.render('productlistadmin', {
            title: 'List View',
            data: await Product.find({ _id: { $in: ["61260dd0987170692cea6ce5","61260db5987170692cea6ce3"] }}),
            user: req.user || ""
        });
       
    } catch (err) {
        return ({ message: err })
    }
});

router.delete('/delete', async (req, res) => {

console.log(JSON.stringify(req.body.pid) + '  and  '+ JSON.stringify(req.query))
    await Product.findOneAndDelete({p_id: req.body.pid })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: 'Cannot delete Tutorial with id='+ req.params.pid +' Maybe Tutorial was not found!'
        });
      } else {
        res.send({
          message: "Product was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Product with id=" + req.params.pid
      });
    });

   
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
