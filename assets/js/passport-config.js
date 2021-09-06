if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
  }

const LocalStrategy = require('passport-local').Strategy
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
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

    passport.use(new GoogleStrategy({
        callbackURL : process.env.callbackURL,
        clientID : process.env.clientId,
        clientSecret : process.env.clientSecret
    }, async (accessToken, refreshToken, profile, done) => {
        console.log(JSON.stringify(profile)  + "  xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx...............xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx ")

        let user = await User.findOne({ googleId: profile.id });

        console.log(user + " XXXXXXXXXXXXXXXXXXXX-----------------------XXXXXXXXXXXXXXXXXXXXX")
            if(user){
        //         console.log(JSON.stringify(user)  + "  xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx ")
                return done(null, user);
            }
            else{
                console.log(profile)
                const user = new User({
                    username: profile.displayName,
                    googleId: profile.id
                })

                const savedUser =  user.save();
                // console.log(savedUser + "  ******************************************************************************" )
                return done(null, savedUser);
            }
    }))
    passport.serializeUser(function(user, done) {
        done(null, user._id);
      });

      passport.deserializeUser((user , done) => {
        done(null, user);
      });
    // // passport.serializeUser((user, done) => done(null, user.googleId))
    // passport.deserializeUser((_id, done) => {
    //     let user = User.findOne(_id)
    //     console.log(user)
    //     done(null, user)
    // }
    
    // )
}



module.exports = initialize