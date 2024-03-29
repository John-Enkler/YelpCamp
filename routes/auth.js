var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

//Root Route
router.get("/", function(req, res){
  res.render("landing");
});
/*----------------------
AUTHENTICATION ROUTES
-----------------------*/
router.get("/register", function(req, res){
  res.render("register");
});
router.post("/register", function(req, res){
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, function(err, user){
    if(err){
      console.log(err);
      return req.render("register");
    }else{
      passport.authenticate("local")(req, res, function(){
        res.redirect("/campgrounds");
      });
    }
  });
});

//Show Login Form
router.get("/login", function(req, res){
  res.render("login");
});
//handle login logic
router.post("/login", passport.authenticate("local",
{
  successRedirect: "/campgrounds",
  failureRedirect: "/login"
}), function(req,res){
});

router.get("/logout", function(req,res){
  req.logout();
  req.flash("success", "Logged you out!");
  res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login")
}
/*-----------------
END AUTHENTICATION
------------------*/

module.exports = router;