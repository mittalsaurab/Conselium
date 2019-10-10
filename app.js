// require('dotenv').config();


var express= require("express");
var mongoose=require("mongoose");
var app = express(); 
var flash = require("connect-flash")
var passport = require('passport')
var bodyParser = require('body-parser')
var LocalStrategy = require('passport-local')
var passportLocalMongoose = require('passport-local-mongoose')
var methodOverride = require('method-override')
var alert = require('alert-node')

var User = require('./models/user.js')
var Vacancy = require('./models/vacancy.js')
var Institute = require("./models/institute.js")
var Applicant = require("./models/applicant.js")

mongoose.connect("mongodb://localhost/conselium",{useUnifiedTopology: true, useNewUrlParser: true});

app.use(flash());

app.set("view engine","ejs")

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());	
// app.use(methodOverride("_method"));

app.use(require("express-session")({
	secret:"I am having interest in cp too",
	resave:false,
	saveUninitialized:false
}))

app.use(passport.initialize());

app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());

passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser=req.user;
	res.locals.error=req.flash("error");
	res.locals.success=req.flash("success");
	next();
})

//HOME PAGE

app.get('/',function(req, res){
	alert('home')
	res.render("landing.ejs")
})

// LOGIN AND REGISTRAION 

app.get('/register',function(req,res){
	res.render("register.ejs");	
	
})

app.post('/register',function(req, res){

	// console.log("Data "+req.body)

	var newUser=new User({username:req.body.username, isApplicant : req.body.isApplicant });
	
	User.register(newUser,req.body.password,function(err,user){
		if(err){
			console.log("Error "+err);
			res.redirect('/register'); 
		}else{
			// console.log(user);
			passport.authenticate("local")(req,res,function(){
				res.redirect("/");
			})
		}
	})
})


app.get('/login', function(req, res){
	res.render("login.ejs");
})

app.post('/login',passport.authenticate("local",{
	successRedirect:"/",
	failureRedirect:"/login",
	successFlash:"Successfully Logged in ...",
	failureFlash:true
}),function(req,res){

});


app.get('/logout',function(req,res){
	req.logout();
	req.flash("success","Successfully Logged Out ..");
	res.redirect('/');
})


isLoggedIn=function(req,res,next){
		if(req.isAuthenticated()){
			return next();
		}else{
			req.flash("error","Please Login First ..!");
			res.redirect('/login');
		}
}



// USER'S Profile Routes


app.listen(3000, function(){
	console.log("Server Started!")
})