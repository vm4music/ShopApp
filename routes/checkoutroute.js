const express = require('express');
const { model } = require('mongoose');
const mongoose = require('mongoose');
let Cart = require('../assets/js/cart')
const FinalOrder = require('../models/FinalOrder')
const Order = require('../models/Order')
const Product = require('../models/Product')
const Review = require('../models/Review')

const Paytm = require('paytmchecksum')
const https = require('https');
const { session } = require('passport');
const User = require('../models/User');

let orderStatus = {
    INITIATED : "initiated",
    SUCCESS : "success",
    FAIL : "fail",
    CANCELLED : "cancelled",
    SHIPPED : "shipped"
}

const router = express.Router();

router.get('/', (req, res) => {

    var cart = new Cart(req.session.cart ? req.session.cart : {});
    try {
        res.render('checkout', {
            title: 'Little Bugs',
            // about: about_us,
            cart: cart.generateArray(),
            user: req.user || ""
        });
    } catch (err) {
        return ({ message: err })
    }

})

router.post('/', (req, res) => {

    //Get the Price of the products based on the product ids received from Client to calculate the acutal cost of the order
    // as the price can be manupulated from Client side.

    console.log(req.user + " TOTAL PRICE");
    var orderID = 'TEST_' + new Date().getTime();
    var custID = 'CUST_' + new Date().getTime();
    // var orderID = "TEST_123";

    var paytmParams = {};

    paytmParams.body = {
        "requestType": "Payment",
        "mid": process.env.MID,
        "websiteName": "WEBSTAGING",
        "orderId": orderID,
        "callbackUrl": process.env.CALLBACK_PAYTM,
        "txnAmount": {
            // "value": req.body.totalPrice,
            // Value of the order should not be taken from the client side, For the security purpose, amount should only be calculated on the server side, based on the items in Cart.
            "value": "1",
            "currency": "INR",
        },
        "userInfo": {
            "custId": custID,
        },
    };

    /*
    * Generate checksum by parameters we have in body
    * Find your Merchant Key in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys 
    */
    Paytm.generateSignature(JSON.stringify(paytmParams.body), process.env.MERCHANT_KEY).then(function (checksum) {

        paytmParams.head = {
            "signature": checksum
        };

        var post_data = JSON.stringify(paytmParams);

        var options = {
            /* for Staging */
            hostname: process.env.STAGE_URL_SHORT,
            port: 443,
            path: '/theia/api/v1/initiateTransaction?mid='+ process.env.MID +'&orderId=' + orderID,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': post_data.length
            }
        };

        var response = "";
        var post_req = https.request(options, function (post_res) {
            post_res.on('data', function (chunk) {
                response += chunk;
            });

            post_res.on('end', function () {

                console.log('Response: ', response);
                var re = JSON.parse(response.toString());
                console.log('Response 2: ' + re.body.txnToken);

                var finalOrder = new FinalOrder({
                    user : req.user,
                    cart :  new Cart(req.session.cart || {}),
                    name : req.body.firstname,
                    email : req.body.email,
                    address : req.body.address,
                    city: req.body.city,
                    state : req.body.state,
                    zip : req.body.zip,
                    paymentId: re.body.txnToken,
                    orderId: orderID,
                    status : orderStatus.INITIATED

                });
                finalOrder.save(function(error, result){
                    if(error)
                        console.log("Error in saving the order " + error);
                    console.log("Order created successfully");
                    //Update the inventory Logic is pending...

                    // req.session.cart = null;
                    //DELETE THE CART FROM DATABASE

                    // res.redirect('/');
                })
                var params = {};
                params['mid'] = process.env.MID;
                params['orderId'] = orderID;
                params['txnToken'] = re.body.txnToken;
                var FORM_ACTION = process.env.STAGE_URL;

                var form_fields = "";
                for (var x in params) {
                    form_fields += "<input type='hidden' name='" + x + "' value='" + params[x] + "' >";
                }

                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write('<html><head><title>Merchant Checkout Page</title></head><body><center><h1>Please do not refresh this page...</h1></center><form method="post" action="' + FORM_ACTION + '" name="paytm">' + form_fields + '</form><script type="text/javascript">document.paytm.submit();</script></body></html>');
                res.end();

            });
        });
        // console.log(post_data)
        post_req.write(post_data);
        post_req.end();
    });
})

router.post("/callback", connectMongoose, (req, res) => {

    console.log(req + " TOTAL PRICE2");
    /* initialize an object */
    var paytmParams = {};

    /* body parameters */
    paytmParams.body = {

        "mid": process.env.MID,

        /* Enter your order id which needs to be check status for */
        "orderId": req.body.ORDERID,
    };

    /**
    * Generate checksum by parameters we have in body
    */
    Paytm.generateSignature(JSON.stringify(paytmParams.body), process.env.MERCHANT_KEY).then(function (checksum) {
        
        /* head parameters */
        paytmParams.head = {
            /* put generated checksum value here */
            "signature": checksum
        };

        /* prepare JSON string for request */
        var post_data = JSON.stringify(paytmParams);

        var options = {

            /* for Staging */
            hostname: 'securegw-stage.paytm.in',

            /* for Production */
            // hostname: 'securegw.paytm.in',

            port: 443,
            path: '/v3/order/status',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': post_data.length
            }
        };

        // Set up the request
        var response = "";
        var post_req = https.request(options, function (post_res) {
            post_res.on('data', function (chunk) {
                response += chunk;
            });

            post_res.on('end', async function () {
                console.log('Response 222: ', response);
                var _result = JSON.parse(response);
                if (_result.body.resultInfo.resultStatus == 'TXN_SUCCESS') {
                    //Update the FINAL ORDERS record for this TRANSACTION
                    await FinalOrder.findOneAndUpdate({orderId : _result.body.orderId}, {status : orderStatus.SUCCESS}, {useFindAndModify: false})

                    //Delete the session cart and delete the cart from DB
                    await Order.deleteMany({user: req.user}, {useFindAndModify: false}, function(err){
                        if(err)
                            console.log("Error Deleting the cart")
                    });
                    console.log(req.session.cart);
                    delete req.session.cart
                    delete session.cart
                    console.log(req.session.cart);
                    console.log(req.user + "  callback *****************************")

                    let order_details = {};
                    order_details.orderId = _result.body.orderId;
                    res.render('paymentstatus', {
                        // title: 'Payment',
                        user: req.user,
                        orderDetails : order_details
                    });
                } else {
                    //Update the FINAL ORDERS record for this TRANSACTION [when the transaction has failed]
                    //Update the inventory as well as the order has failed...
                    res.send('payment failed')
                }
                   
                    // res.send('payment sucess')
            });
            
        });
        // post the data
        post_req.write(post_data);
        post_req.end();
    });
});

router.get('/ordersummary', async (req, res) => {

    try {
        res.render('paymentstatus', {
            title: 'Payment',
            user: req.user || ""            
        });
    } catch (err) {
        return ({ message: err })
    }
});

router.get('/orders', connectMongoose, checkAuthenticated, async (req, res) => {

    var cart = '';
    FinalOrder.find( {user : req.user} , (error, finalorders) => {
        if(error)
            return res.write("Error Fetching the orders");
        finalorders.forEach(order =>{
            cart = new Cart(order.cart);
            order.items = cart.generateArray();
        })
        
        try {

            console.log(finalorders);

            res.render('mypurchases', {
                title: 'Orders',
                user: req.user || "",
                orders: finalorders
            });
        } catch (err) {
            return ({ message: err })
        }

    })

   
});


router.post("/review", connectMongoose, async (req, res) => {

    var user = await User.findById(req.user);
    console.log(user.email + " ffffffffffffffffffffffffffff")
    const review = new Review({
        user: req.user,
        username : user.email,
        product: req.body.product,
        review_detail: req.body.review.split("\n"),
    })

    try {
        const savedReview = await review.save();
        // res.json(savedReview);

        var cart = '';
        FinalOrder.find({ user: req.user }, (error, finalorders) => {
            if (error)
                return res.write("Error Fetching the orders");
            finalorders.forEach(order => {
                cart = new Cart(order.cart);
                order.items = cart.generateArray();
            })

            try {
                res.render('mypurchases', {
                    title: 'Orders',
                    user: req.user || "",
                    orders: finalorders
                });
            } catch (err) {
                return ({ message: err })
            }

        })
    } catch (err) {
        res.json({ message: err })
    }

})

router.get('/add-to-cart/:p_id', checkAuthenticated, async (req, res) => {
    await Product.findOne({ p_id: req.params.p_id }, async function (err, product) {
        if (err) {
            console.log("Error in finding the product to add to Cart: " + err);
        }
        else {
            try {
                let cartObj = {};
                if (req.session.cart) {
                    cartObj = req.session.cart;
                } else {
                    await Order.findOne({ user: req.session.passport.user }, function (err, order) {
                        if (err) {
                            console.log(err + " Order Error");
                        }
                        else {

                            
                            cartObj = order ? order : {};
                        }
                    })
                }

                var cart = new Cart(cartObj, req.session.passport.user);
                // var cart = new Cart(req.session.cart ? req.session.cart : {});

                cart.add(product, product.p_id)
                req.session.cart = cart;

                console.log("Updated Cart***************************");
                console.log(cart);
                console.log("*************************Updated Cart end***************************");

                var wishlist = []
                if (req.session.wishlist)
                    wishlist = req.session.wishlist.includes(req.params.p_id)

                    var cart = new Cart(req.session.cart ? req.session.cart : {});
        
                res.render('checkout', {
                    title: 'Little Bugs',
                    // about: about_us,
                    cart: cart.generateArray(),
                    user: req.user || ""
                });

                // res.render('product', {
                //     title: 'Product View',
                //     data: product,
                //     user: req.user || "",
                //     cart: cart.generateArray(),
                //     wishlist: wishlist
                // });

            } catch (error) {
                console.log("Error in add the product to the cart: " + error)
            }
        }
    });
})

function connectMongoose(req, res, next) {
    if (mongoose.connection.readyState < 1)
        mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, () => console.log("test DB"));
    next()
}

function checkAuthenticated(req, res, next) {
    req.session.returnTo = req.originalUrl;
    if (req.isAuthenticated()) {
        return next()
    }

    res.redirect('/users/login')

}
module.exports = router;