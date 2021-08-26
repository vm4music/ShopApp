const LocalStrategy = require('passport-local').Strategy
const mongoose = require('mongoose');
const User = require('../../models/User')
const bcrypt = require('bcrypt')


function initialize(passport){
    const authenticateUser =  (email, password, done) => {
        console.log(email + " CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC")
          User.findOne({ email: email},async function (err, user) {
            if (err){
                console.log(err);
            }
            else{
                if(user == null){
                    return done(null, false, {message : 'Username or Password incorrect.'})
                }
                try {
                    console.log(user.username + "  " + user.email)
                    if(await bcrypt.compare(password, user.password)){
                        return done(null, user)
                    }
                    else{
                        return done(null, false, {message : 'Username or Password incorrect'})
                    }
                    
                } catch (error) {
                    return done(e)
                }
            }
        });
    }
    passport.use(new LocalStrategy({usernameField: 'email'}, authenticateUser))
    passport.serializeUser((user, done) => done(null, user._id))
    passport.deserializeUser((_id, done) => 
    done(null, User.findById(_id))
    )
}

module.exports = initialize