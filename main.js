if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
const Product = require('./models/Product')
const Order = require('./models/Order');
const Review = require('./models/Review')
const methodOverride = require('method-override')
let Cart = require('./assets/js/cart')
const flash = require('express-flash')

let MongoStore = require('connect-mongo');

const app = express();
app.set('view engine', 'ejs'); // configure template engine

//MIDDLEWARES
app.use(flash())
app.use(methodOverride('_method'))

const initializePassport = require('./assets/js/passport-config');
initializePassport(passport)

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DB_CONNECTION }),
    cookie: { maxAge: 100 * 60 * 1000 }
    
}))
app.use(passport.initialize())
app.use(passport.session())

app.use('/assets', express.static(__dirname + '/assets'));

//Body Parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json())

//IMPORT ROUTES
const productsRoute = require('./routes/product');
const userRoute = require('./routes/userroute');
const checkoutRoute = require('./routes/checkoutroute');
const adminRoute = require('./routes/adminroute');

const { getProductsForIndex, getProductsWithPage, getWishlist } = require('./db/productdbservice');
const User = require('./models/User');
const FinalOrder = require('./models/FinalOrder');


app.use(async function (req, res, next) {

    res.locals.session = req.session;
    res.locals.login = req.isAuthenticated()  // 

    if (req.session.passport) {
        let cartObj = {};
        if (req.session.cart) {
            cartObj = req.session.cart;
        } else {
            await Order.findOne({ user: req.user }, async function (err, order) {
                if (err) {
                    console.log(err + " Order Error");
                }
                else {
                    console.log(JSON.stringify(order) + " add to cart")
                    cartObj = (order == null) ? {} : order;
                }
            })
        }
        req.session.cart = new Cart(cartObj);
    }
    next();
});

//ROUTERS
app.use('/products', productsRoute);
app.use('/users', userRoute);
app.use('/checkout', checkoutRoute);
app.use('/admin', adminRoute);
// app.use('/views', express.static(__dirname + '/views'));
// app.set('views', __dirname + '/views'); // set express to look in this folder to render our view

//use node main.js for production 
var about_us = {
    "title": "Our children deserve the best",
    "descripton_line_1": "Play is a Child’s Work and Our Store is a child’s workshop of award-winning toys carefully selected for excellence in play value, design, quality and impact on environment. Every toy we choose is evaluated for these qualities and we do not compromise because we believe our children deserve the best.",
    "descripton_line_2": "Anything else is just not good enough."
}

//========== ROUTERS START =============//
app.get('/', connectMongoose, checkWishList, async (req, res) => {

    try {
        res.render('index', {
            title: 'Little Bugs',
            about: about_us,
            data: await getProductsForIndex(),
            user: req.user || ""
        });
    } catch (err) {
        return ({ message: err })
    }
});

app.get('/orderdetail/:order_id', connectMongoose, checkWishList, async (req, res) => {
    
    var cart = '';
    console.log(req.params.order_id)
    await FinalOrder.findById( req.params.order_id , (error, finalorders) => {
        if(error)
            return res.write("Error Fetching the order details");

            console.log(finalorders)
            cart = new Cart(finalorders.cart);
            finalorders.items = cart.generateArray();
        
        try {
            res.render('orderdetail', {
                title: 'Order Details',
                user: req.user || "",
                orders: finalorders
            });
        } catch (err) {
            return ({ message: err })
        }
    })
});

/**
 * parameters:
 * Page : Page number to be returned
 * Sort : Sort in which the result needs to be sorted
 * Text : [Optional] keyword against which results need to be searched
 * Category : Category of the products for which the results need to be displayed
 * 
 * 
 */
app.get('/shop', connectMongoose, async (req, res) => {
    try {
        var wishlist = []
        if (req.session.wishlist)
            wishlist = req.session.wishlist

        let page = req.query.page || 1;
        let sort = req.query.sort || "Price High-to-Low";

        let text = {};
        text.key = req.query.text || "";
        text.category = req.query.category || "";
        res.render('listview', {
            title: 'sdfs',
            data: (await getProductsWithPage(page, 6, sort, text)),
            user: req.user || "",
            wishlist: wishlist || []
        });

    } catch (err) {
        return ({ message: err })
    }
});

/*-=========================SEND WISHLIST==========================-*/
app.post('/wishlist', checkAuthenticated, connectMongoose, async (req, res) => {

    try {
        var message = "";
        console.log(req.body.pid)
        var pid = req.body.pid;

        await User.findById(req.session.passport.user, function (err, user) {
            if (err)
                console.log("Error updating the wishlish " + err)

            if (!err) {

                if (user.wishlist.includes(pid)) {
                    user.wishlist.pull(pid);
                    message = "Removed from wishlist";
                } else {
                    user.wishlist.push(pid);
                    message = "Added to wishlist";

                }
                user.save();

                req.session.wishlist = user.wishlist
                console.log(req.session.wishlist)
                res.json({ message: message })

            }
        })
    } catch (error) {
        console.log("Error in updating the wishlist : " + error)
    }
});

/*-=========================Get WISHLIST==========================-*/
app.get('/wishlist', checkAuthenticated, connectMongoose, async (req, res) => {

    try {

        var wishlist = []
        if (req.session.wishlist)
            wishlist = req.session.wishlist

        let page = req.query.page || 1;
        let sort = req.query.sort || "Price High-to-Low";

        let text = {};
        text.key = req.query.text || "";
        text.category = req.query.category || "";
        text.wishlist = wishlist
        res.render('wishlist', {
            title: 'sdfs',
            data: (await getWishlist(page, 6, sort, text)),
            user: req.user || "",
            wishlist: wishlist || []
        });

    } catch (err) {
        return ({ message: err })
    }
});

//==================== PRODUCT PAGE =============================//
app.get('/product/:p_id', connectMongoose, async (req, res) => {

    var cart = new Cart(req.session.cart ? req.session.cart : {});

    var wishlist = []
    if (req.session.wishlist)
        wishlist = req.session.wishlist.includes(req.params.p_id)
    await Product.findOneAndUpdate({ p_id: req.params.p_id }, { $inc: { 'popular': 1 } }, { new: true, useFindAndModify: false }, function (err, product) {
        if (err)
            console.log("There is an error updating the popularity of the product. ");

        Review.find({ product: product._id }, function (err, reviews) {
            res.render('product', {
                title: 'Product View',
                data: product,
                user: req.user || "",
                cart: cart.generateArray(),
                wishlist: wishlist,
                reviews: reviews
            });
        })

    })
})

//====================AJAX ADD TO CART =============================//
app.post('/add-to-cart', checkAuthenticatedAjax, connectMongoose, async (req, res) => {

    var productid = req.body.product__ID;
    await Product.findOne({ p_id: productid }, async function (err, product) {
        if (err)
            console.log("Error in finding the product to add to Cart: " + err);

            try {
                let cartObj = {};
                if (req.session.cart) {
                    cartObj = req.session.cart;
                } else {
                    await Order.findOne({ user: req.session.passport.user }, function (err, order) {
                        if (err) {
                            console.log(err + " Order Error");
                        }
                            cartObj = order ? order : {};
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

                    await Review.find({product : product._id}, function (err, reviews){

                        if(err)
                            console.log("Error getting the reivew");

                        return res.json({status: "Success", cart : cart, message: "Item is added to Cart"});
                    })
                 } catch (error) {
                console.log("Error in add the product to the cart: " + error)
            }
    });
})


app.get('/showcart', (req, res) => {

    var cart = new Cart(req.session.cart ? req.session.cart : {});
    res.render('cart', {
        title: 'Cart View',
        data: "",
        user: req.user || "",
        cart: cart.generateArray()
    });
});

app.get('/remove-item/:id', (req, res) => {
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    cart.remove(req.params.id, req.session.passport.user)
    req.session.cart = cart
    res.render('cart', {
        title: 'Cart View',
        data: "",
        user: req.user || "",
        cart: cart.generateArray()
    });
});

//==============MIDDLEWARES=================//
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

function checkAuthenticatedAjax(req, res, next) {
    req.session.returnTo = req.originalUrl;
        if (req.isAuthenticated()) {
            return next()
        }
        res.json({ message: '/users/login', status: 401 });
}

async function checkWishList(req, res, next) {

    if (req.session.passport) {
        if (req.session.passport.user != null && req.session.wishlist == null) {
            console.log("PASSPORT ********************")
            console.log(req.session.passport)
            console.log("PASSPORT ********************")
            await User.findById({ _id: req.session.passport.user }, (err, user) => {
                if (!err && (req.session.wishlist != user.wishlist))
                    req.session.wishlist = user.wishlist
            })
        }
    }
    next()
}

//==================== CART RESULTS =============================//
app.get('/add-to-cart/:p_id', checkAuthenticated, connectMongoose, async (req, res) => {
    
    await Product.findOne({ p_id: req.params.p_id }, async function (err, product) {
        if (err) {
            console.log("Error in finding the product to add to Cart: " + err);
        }
            try {
                let cartObj = {};
                if (req.session.cart) {
                    cartObj = req.session.cart;
                } else {
                    await Order.findOne({ user: req.session.passport.user }, function (err, order) {
                        if (err) {
                            console.log(err + " Order Error");
                        }
                            cartObj = order ? order : {};
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

                    await Review.find({product : product._id}, function (err, reviews){

                        if(err)
                            console.log("Error getting the reivew");

                        res.render('product', {
                            title: 'Product View',
                            data: product,
                            user: req.user || "",
                            cart: cart.generateArray(),
                            wishlist: wishlist,
                            reviews : reviews
                        });
                    })

                 } catch (error) {
                console.log("Error in add the product to the cart: " + error)
            }
    });
})

app.get('/times', (req, res) => res.send(showTimes()))

showTimes = () => {
    let result = '';
    const times = process.env.TIMES || 5;
    for (i = 0; i < times; i++) {
        result += i + ' ';
    }
    return result;
}

//\\======= API Response ENDS ========//\\
const port = process.env.PORT || 8081;

app.listen(port, () => {
    console.log(`App running on ${port}`);
})