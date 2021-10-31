const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport')
const jwt = require('jsonwebtoken')
var nodemailer = require('nodemailer');

const router = express.Router();

const User = require('../models/User')

const mongoose = require('mongoose')

const JWT_SECRET = "SOME SUPER SECRET..."

var about_us = {
    "title": "Our children deserve the best",
    "descripton_line_1": "Play is a Child’s Work and Our Store is a child’s workshop of award-winning toys carefully selected for excellence in play value, design, quality and impact on environment. Every toy we choose is evaluated for these qualities and we do not compromise because we believe our children deserve the best.",
    "descripton_line_2": "Anything else is just not good enough."
}

var productsFromAPI = [];
//ROUTES
router.get('/', checkAuthenticated, async (req, res) => {


    res.render('index', {
        title: 'Little Bugs',
        about: about_us,
        data: (productsFromAPI)
    });

})

router.post('/sign-up', async (req, res) => {

    try {

        const user = new User({
            username: req.body.username,
            password: await bcrypt.hash(req.body.password, 10),
            email: req.body.email,
        })
        const savedUser = await user.save();
        console.log("Registered user: " + savedUser);
        res.status(200).send('User Registered Successfully.');
    }
    catch (err) {
        res.status(500).send('Error Registering the user ' + err)
    }

})

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureMessage: true,
    failureFlash: true
}))

//==================LOGIN===========================//
router.get('/login', checkNotAuthenticated, (req, res) => {
    try {
        res.render('login', {
            title: 'Login Page',
            data: "list",
            user: req.user || ""
        });

    } catch (error) {
        res.redirect('/')
    }

});


router.get('/google', connectMongoose, passport.authenticate('google', 
{
    scope: ['https://www.googleapis.com/auth/userinfo.profile' ,'https://www.googleapis.com/auth/userinfo.email']
}))

router.get('/google/redirect', connectMongoose, passport.authenticate('google',{ failureRedirect: '/users/login'}), (req, res) => {
    res.redirect(req.session.returnTo || '/')
});


router.get('/forgot-password', (req, res) => {
    res.render('forgot-password',{
        user: req.user || ""
    })
})

router.post('/forgot-password',connectMongoose, async (req, res) => {
    const {email} = req.body

    await User.findOne({email : email}, (err, user) => {
        if(err)
            console.log(err)

        if(!user)
            console.log('USER IS NOT REGISTERED');

        console.log(user.email + " and " + user.username)

        const secret = JWT_SECRET + user.password

        const payload = {
            email : user.email,
            id : user.id
        }

        const token = jwt.sign(payload, secret, {expiresIn: '15m'})

        const link = process.env.RESET_PASSWORD + user.id + '/' + token

        sendEmail('gmail', link);

        console.log(link);

    })

    res.writeHead(200, {"Content-Type": "text/html"});  
    res.write('<h1 style="justify-content:center;display:flex;margin: 200px 50px 50px 50px">Password reset link has been sent to your email</h1>');  
    res.end();
    // res.send('Password reset link has been sent to your email')
})

router.get('/reset-password/:id/:token', connectMongoose, async (req, res) => {
    const {id , token} = req.params

    await User.findById(id, (err, user) => {
        if(err)
            console.log(err)

        if(!user)
            console.log("No user with this ID: ")

        const secret = JWT_SECRET + user.password

        try {

             const payload = jwt.verify(token, secret)
             if(payload)
                 res.render('reset-password', {
                    email : user.email,
                    user: req.user || "",
                    payloadParams : {id : id, token: token}
                })
            
        } catch (error) {
            console.log(error.message)
            res.send(error.message)
        }
    })

    // res.send(req.params)
})

router.post('/reset-password', connectMongoose, async (req, res) => {
    // const {id , token} = req.params;
    const {id, token, password1, password2} = req.body;

    console.log(id + "is the id from reset link")
    await User.findById(id, async (err, user) => {
        if(err)
            console.log(err)

        if(!user)
            console.log("No user with this ID: ")

        const secret = JWT_SECRET + user.password

        try {

            if(password1 !== password2)
                return;


            const payload = jwt.verify(token, secret)

            // Check if both the passwords are same.

            if(payload){
                console.log("Payload")
                console.log(payload + " and password: "+ password2)
                console.log("payload ends")
            }

            user.password = await bcrypt.hash(password2, 10);
            user.save();


            res.redirect('/');
           
       } catch (error) {
           console.log(error.message)
           res.send(error.message)
       }

    })
})

router.delete('/logout', (req, res) => {
    delete req.session.cart;
    delete req.session.returnTo;
    req.logOut()
    res.redirect('/users/login')
  })


  //==============MIDDLEWARES=================//
function connectMongoose(req, res, next) {
    if (mongoose.connection.readyState < 1)
        mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true  }, () => console.log("test DB"));
    next()
}

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }

    res.redirect('/login')

}

function checkNotAuthenticated(req, res, next) {
    console.log("this ==============================================="+req.isAuthenticated())
    if (req.isAuthenticated()) {
        res.redirect('/')
        return
    }
    next()
}


//============== EMAIL ===================//
function sendEmail(mailservice, link) {

    var transporter = nodemailer.createTransport({
        service: mailservice,
        // host: 'smtp.gmail.com',
        // port: 587,
      auth: {
            user: 'malhotra.vikas3.0@gmail.com',
            pass: 'fuckyou@123!'
        }
    });

    var mailOptions = {
        from: 'malhotra.vikas3.0@gmail.com',
        to: 'vm4music@gmail.com',
        subject: 'Reset Password Link',
        html: '<a href="'+ link +'">Reset Link</a>'
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = router;
