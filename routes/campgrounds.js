var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

router.get("/", function(req, res){

  // get all campgrounds from db
  Campground.find({}, function(err, allCampgrounds){
    if(err){
      console.log(err);
    }
    else{
      res.render("campgrounds/index",{campgrounds:allCampgrounds, currentUser: req.user});
    }
  });
});


router.get("/new", middleware.isLoggedIn, function(req,res){
  res.render("campgrounds/new");
});

//CREATE NEW campground and save to database
router.post("/", middleware.isLoggedIn, function(req, res){
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  }
  var newCampGround = {name:name, image:image, description:desc, author:author}

  Campground.create(newCampGround, function(err, newlyCreated){
    if(err){
      console.log(err);
    }
    else{
      res.redirect("/");
    }
  });
});
// SHOW - shows more info about one campground
router.get("/:id", function(req, res){
  // find the campground withprovided id
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
    if(err){
      console.log(err);
    }
    else{
      console.log(foundCampground);
      //render show template with that campground
      res.render("campgrounds/show",{campground:foundCampground});
    }
  });
});

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkAuthenticate, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
      res.render("campgrounds/edit", {campground: foundCampground});
    });
    //does user own campground
});
//UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkAuthenticate, function(req, res){
//find and update
Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
  if(err){
    res.redirect("/campgrounds");
}else{
  res.redirect("/campgrounds/" + req.params.id);
}
});
//rediriect
});
//DESTROY
router.delete("/:id", middleware.checkAuthenticate, function(req, res){
  // res.send("You Are Trying To Delete Something!");
  Campground.findByIdAndRemove(req.params.id, function(err){
    if(err){
      console.log("The Item Was not Deleted"+ err);
      res.redirect("/campgrounds");
    }
    else{
      console.log("The item was deleted");
      res.redirect("/campgrounds");
    }
  });
});

module.exports = router;