var express= require("express");
var mongoose=require("mongoose");
var app = express(); 
var flash = require("connect-flash")
var passport = require('passport')
var bodyParser = require('body-parser')
var LocalStrategy = require('passport-local')


var User = require('./models/user.js')
var Vacancy = require('./models/vacancy.js')
var Institute = require("./models/institute.js")
var Applicant = require("./models/applicant.js")

mongoose.connect("mongodb://localhost/conselium",{useUnifiedTopology: true, useNewUrlParser: true});

app.use(flash());

app.use(bodyParser.urlencoded({extended:true}));

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
	next();
})



app.get('/',function(req, res){
	// Home Page Landing
	res.render("landing.ejs")
})

app.get('/register',function(req,res){
	res.render("register.ejs");	
	
})

app.post('/register/',function(req, res){

	console.log("Here Ur Data Goes "+req.body.email)

	var newUser={username:req.body.email, isApplicant : req.body.isApplicant };
	
	// eval(require('locus'));

	User.register(newUser,req.body.password,function(err,user){
		
		if(err){
			console.log("Show this");
			console.log(err);
			// req.flash("error",err.message);
			res.redirect('/register'); 
		}else{
			//console.log(user);
			// eval(require('locus'));
			passport.authenticate("local")(req,res,function(){
			// eval(require('locus'));
				res.redirect("/register");
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
	// successFlash:"Successfully Logged in ...",
	// failureFlash:true
}),function(req,res){

});


app.get('/logout',function(req,res){
	req.logout();
	req.flash("success","Successfully Logged Out ..");
	res.redirect('/campgrounds');
})

app.listen(3000, function(){
	console.log("Server Started!")
})