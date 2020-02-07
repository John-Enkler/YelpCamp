var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middlewareObj ={};


/**
 * MIDDLEWARE
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */

middlewareObj.isLoggedIn = function (req, res, next) {
  if (req.isAuthenticated()) {
    req.flash("error", "You need to be logged in to do that");
    return next();
  }
  req.flash("error", "Please Login First!");
  res.redirect("/login");
}

//AUTHENTICATION FUNCTION
middlewareObj.checkCommentOwnership = function(req, res, next) {
  if (req.isAuthenticated()) {

    Comment.findById(req.params.comment_id, function (err, foundComment) {

      if (err) {
        res.redirect("back");
      }
      else {
        if (foundComment.author.id.equals(req.user._id)) {
          next();
        } else {
          res.redirect("back");
        }
      }
    });

  } else {
    console.log("You must be logged in");
    res.redirect("back");
  }
}

middlewareObj.checkAuthenticate = function(req, res, next){
  if(req.isAuthenticated()){

    Campground.findById(req.params.id, function(err, foundCampground){

      if(err){
        req.flash("error", "Campground Not Found!");
        res.redirect("back");
      } 
      else{
        if(foundCampground.author.id.equals(req.user._id)){
          next();
        }else{
          req.flash("error", "You don't have persmission to do that");
          res.redirect("back");
        }
      }
    });

  }else{
    console.log("You must be logged in");
    res.redirect("back");
  }
}

module.exports = middlewareObj;