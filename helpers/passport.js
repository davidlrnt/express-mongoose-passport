const bcrypt        = require("bcrypt");
const passport 			= require('passport');
const LocalStrategy = require("passport-local").Strategy;
const FbStrategy    = require('passport-facebook').Strategy;
const GoogleStrategy= require('passport-google-oauth20').Strategy;
const User          = require('../models/user');

require('dotenv').config()

const FACEBOOK_CLIENT_ID    = process.env.FACEBOOK_CLIENT_ID;
const FACEBOOK_CLIENT_SECRET = process.env.FACEBOOK_CLIENT_SECRET;
const GOOGLE_CLIENT_ID      = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

passport.serializeUser((user, cb)   => { cb(null, user) });
passport.deserializeUser((user, cb) => { cb(null, user) });

passport.use(new LocalStrategy({
    passReqToCallback: true
  }, (req, username, password, next) => {
    User.findOne({ username }, (err, user) => {
      if (err) {
        console.log("ERR",err);
        return next(err);
      }
      if (!user) {
        return next(null, false, { message: "Incorrect email" });
      }
      if (!bcrypt.compareSync(password, user.password)) {
        return next(null, false, { message: "Incorrect password" });
      }
      return next(null, user);
    });
}));


passport.use(new FbStrategy({
	  clientID: FACEBOOK_CLIENT_ID,
	  clientSecret: FACEBOOK_CLIENT_SECRET,
	  callbackURL: "http://localhost:3000/auth/facebook/callback",
	  profileFields: ['id', 'displayName', 'email', 'locale', 'timezone', 'verified', 'updated_time', 'birthday', 'friends', 'first_name', 'last_name', 'middle_name', 'gender', 'link']
	}, (accessToken, refreshToken, profile, done) => {

		const id = profile.id;
		const email = profile.emails[0].value;
		const name = profile.displayName;
    process.nextTick(function() {
     
      // find the user in the database based on their email
      User.findOne({ username: email }, function(err, user) {
 
        // if there is an error return error
        if (err)
          return done(err);
          if (user) {
            // if user signed up locally and tries to sign up with facebook, facebook object will have no data, update record before continuing.
            if (user.facebook.id === id && user.facebook.token === accessToken && user.facebook.name === name){
              return done(null, user); // user found, return that user
            } else {
              console.log("updating user record");
              user.facebook.id    = id;               
              user.facebook.token = accessToken; 
              user.facebook.name  = name;

              user.save(function(err) {
                if (err)
                  throw err;
                return done(null, user);
              });
            }
          } else {
            // if there is no user found with that email, create it
            var newUser = new User();
 
            // set all of the facebook information in our user model
            newUser.facebook.id    = id;           
            newUser.facebook.token = accessToken;
            newUser.facebook.name  = name;
            newUser.username = email; 
            newUser.avatar = `https://graph.facebook.com/${id}/picture?type=large`;

            newUser.save(function(err) {
              if (err)
                throw err;
 							console.log("Created new user: ", newUser);
              return done(null, newUser);
            });
         } 
      });
    });
}));

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
  }, (accessToken, refreshToken, profile, done) => {

    const id = profile.id;
    const email = profile.emails[0].value;
    const name = profile.displayName;
    process.nextTick(function() {
     
      User.findOne({ username: email }, function(err, user) {
        if (err)
          return done(err);
           if (user) {

          	if (user.google.id === id && user.google.token === accessToken && user.google.name === name){
          		return done(null, user); // user found, return that user
          	} else {
          		console.log("user found, but update required");
          		user.google.id    = id;               
	            user.google.token = accessToken; 
	            user.google.name  = name;

	            // save our user to the database
	            user.save(function(err) {
	              if (err)
	                throw err;
	              // if successful, return the new user
	              return done(null, user);
	            });
          	}
          } else {
            var newUser = new User();

 
            newUser.google.id    = id;               
            newUser.google.token = accessToken; 
            newUser.google.name  = name;
            newUser.username = email; 

            // save our user to the database
            newUser.save(function(err) {
              if (err)
                throw err;
              // if successful, return the new user
              return done(null, newUser);
            });
         } 
      });
    });
}));

  
	
module.exports = passport;


