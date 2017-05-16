const express  = require('express');
const bcrypt   = require("bcrypt");
const User     = require("../models/user");
const passport = require("../helpers/passport");

const router     = express.Router();
const bcryptSalt = 10;

/* GET users listing. */
router.get('/signup', function(req, res, next) {
  res.render('auth/signup', { "message": req.flash("error") });
});

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const confpassword = req.body.confpassword;

  if (username === "" || password === "" || password !== confpassword) {
    if(password !== confpassword){ 
      req.flash('error', 'passwords don\'t match' )
    } else {
      req.flash('error', 'Indicate email and password' );
    }
    res.render("auth/signup", { "message": req.flash("error") });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      console.log(user);
      req.flash('error', 'The username already exists' );
      res.render("auth/signup", { message: req.flash("error") });
      return;
    }

    var salt     = bcrypt.genSaltSync(bcryptSalt);
    var hashPass = bcrypt.hashSync(password, salt);

    var newUser = User({
      username: username,
      password: hashPass
    });

    newUser.save((err) => {
      if (err) {
        console.log(err);
        req.flash('error', 'The username already exists' );
        res.render("auth/signup", { message: req.flash('error') });
      } else {
        passport.authenticate("local")(req, res, function () {
           res.redirect('/profile');
        });
      }
    });
  });
});


router.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

router.get("/logout", (req, res) => {
  req.logout();
  delete res.locals.currentUser;
  delete req.session.passport;
  // delete currentUser and passport properties 
  // becasuse when we calling req.logout() is leaving an empty object inside both properties.
  res.redirect('/');
});

// router.get("/auth/facebook/callback", passport.authenticate("facebook", {
//   successRedirect: "/secret",
//   failureRedirect: "/"
// }));
router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home. 
    res.redirect('/');
  }
);

router.get('/auth/facebook',  
  passport.authenticate('facebook', {
    authType: 'rerequest',
    scope: ['user_friends', 'email', 'public_profile'],
    }
  )
);

router.get('/auth/google',
  passport.authenticate('google', { scope: ['email profile'] }));

router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  }
);

module.exports = router;
