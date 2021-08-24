const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport')

const router = express.Router();

const User = require('../models/User')


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
    failureRedirect: '/users/nologin',
    failureMessage: true
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

router.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/users/login')
  })

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


module.exports = router;