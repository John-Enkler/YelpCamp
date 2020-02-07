var express = require("express");
var app = express();
var flash = require("connect-flash");
var bodyparser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var seedDB = require("./seeds");
var User = require("./models/user");
var commentsRoutes = require("./routes/comments");
var authRoutes = require("./routes/auth");
var campgroundRoutes = require("./routes/campgrounds");
var methodOverride = require("method-override");

mongoose.connect("mongodb://localhost/yelp_camp", {useNewUrlParser: true});
app.use(bodyparser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();

//Pasport Configure
app.use(require("express-session")({
  secret:"It's a secret to everyone.",
  resave: false,
  saveUnitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.use("/", authRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentsRoutes);

app.get("*", function(req,res){
  res.send("Page not found!");
});

app.listen(3000, function(){
  console.log("Yelp Camp server has Started");
});
