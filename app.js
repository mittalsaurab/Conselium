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

var middleware = require('./middleware/index.js')

mongoose.connect("mongodb://localhost/conselium",{useUnifiedTopology: true, useNewUrlParser: true});

app.use(flash());

app.set("view engine","ejs")

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());	
app.use(methodOverride("_method"));

app.use(require("express-session")({
	secret:"I am having interest in cp too",
	resave:true,
	saveUninitialized:true
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
	// alert('home')
	Vacancy.find({},function(err, allVacancies){
		if(err){
			console.log(err);
		}else{
			res.render("landing.ejs",{vacs:allVacancies});			
		}
	})
})

// LOGIN AND REGISTRAION 

app.get('/register',function(req,res){
	res.render("register.ejs");	
	
})

app.post('/register',function(req, res){

	console.log("Data "+req.body)

	var newUser=new User({username:req.body.username, isApplicant : req.body.isApplicant });
	
	User.register(newUser,req.body.password,function(err,user){
		if(err){
			console.log("Error "+err);
			res.redirect('/register'); 
		}else{
			// console.log(user);

			var obj ={
				_id : user._id,
			}

			obj.user = {
				id : user._id,
				email : user.username
			}

			if(user.isApplicant=="true"){
				Applicant.create(obj,function(err, newApplicant){
					if(err){
						console.log(err)
					}else{
						console.log("Applicant created Successfully");
					}
				})	
			}else{
				Institute.create(obj,function(err, newApplicant){
					if(err){
						console.log(err)
					}else{
						console.log("Applicant created Successfully");
					}
				})
			}

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


// Applicant'S Profile Routes


app.get('/applicant/:id', function(req, res){

	Applicant.findById(req.params.id, function(err, foundApplicant){
		if(err||!foundApplicant){
			console.log(err);
		}else{
			res.render('appProfile/show',{app:foundApplicant})
		}
	})
})



app.get('/applicant/:id/edit',middleware.checkAppAuth,function(req, res){

	Applicant.findById(req.params.id, function(err, foundApplicant){
		if(err||!foundApplicant){
			console.log(err);
		}else{
			res.render('appProfile/edit',{app:foundApplicant})
		}
	})
})



app.put('/applicant/:id',middleware.checkAppAuth,function(req, res){
	Applicant.findByIdAndUpdate(req.params.id,req.body.app,function(err,updatedApp){
				res.redirect('/applicant/'+req.params.id);			
	})
})



// Institute Profile Feauters 

app.get('/institute/:id',function(req, res){

	Institute.findById(req.params.id, function(err, foundInstitute){
		if(err||!foundInstitute){
			console.log(err);
		}else{
			res.render('instProfile/show',{inst:foundInstitute})
		}
	})
})


app.get('/institute/:id/edit',middleware.checkInstAuth,function(req, res){

	Institute.findById(req.params.id, function(err, foundInstitute){
		if(err||!foundInstitute){
			console.log(err);
		}else{
			res.render('instProfile/edit',{inst:foundInstitute})
		}
	})
})


app.put('/institute/:id', middleware.checkInstAuth, function(req, res){
	Institute.findByIdAndUpdate(req.params.id,req.body.inst,function(err,updatedInstitute){
				res.redirect('/institute/'+req.params.id);			
	})
})

// Vacancy Creation By Institution

app.get('/institute/:id/vacancy/new',middleware.checkInstAuth,function(req, res){
	var inst = {}
	inst._id = req.params.id; 
	res.render("vacancy/new",{inst:inst});
})


app.post('/institute/:id/vacancy',middleware.checkInstAuth, function(req,res){	

	var vacancy = req.body.vac;

	// eval(require('locus'))

	Institute.findById(req.params.id, function(err, foundInstitute){
		if(err){
			console.log(err);
		}else{
			Vacancy.create(vacancy, function(err, newVacancy){
				if(err){
					console.log(err);
				}else{
					
					newVacancy.inst = {
						id : foundInstitute._id,
						name : foundInstitute.instName
					}

					newVacancy.save(); 


					foundInstitute.vacancyList.push(newVacancy);

					foundInstitute.save();

					// eval(require('locus'))

					console.log("Vacancy Created Successfully ");

					res.redirect('/institute/'+req.params.id+"/vacancy/"+newVacancy._id+'/show');
				}
			})
		}
	})	
})


app.get('/institute/:id1/vacancy/:id2/edit', 	middleware.checkInstVacAuth, function(req, res){

	Vacancy.findById(req.params.id2, function(err, foundVacancy){
		if(err){
			console.log(err);
		}else{
			res.render("vacancy/edit",{vac : foundVacancy})
		}
	})

})



app.put('/institute/:id1/vacancy/:id2',middleware.checkInstVacAuth, function(req, res){
	var vac = req.body.vac;

	Vacancy.findByIdAndUpdate(req.params.id2,req.body.vac, function(err, updatedVacancy){
		if(err){
			console.log(err);
		}else{
			res.redirect("/institute/"+req.params.id1+"/vacancy/"+req.params.id2+"/show");
		}
	})
})


app.put('/vacancy/:id/apply',middleware.isLoggedIn, function(req, res){
	Vacancy.findById(req.params.id, function(err, foundVacancy){
		if(err){
			console.log(err);
		}else{	
			// eval(require('locus'))
			currentUser = res.locals.currentUser;
			console.log(currentUser);
			Applicant.findById(currentUser._id,function(err, foundApplicant){
				if(err){
					console.log(err);
				}else{
					foundApplicant.appliedPosts.push(foundVacancy);
					foundApplicant.save(); 
					foundVacancy.applicants.push(currentUser._id);
					foundVacancy.save();
					res.redirect("/vacancy/"+req.params.id+'/show');		
				}
			})	
		}
	})
})



app.get('/vacancy/:id/show',function(req,res){
	Vacancy.findById(req.params.id,function(err, foundVacancy){
		if(err||!foundVacancy){
			console.log(err+"Or Vacancy is not found");
		} 
		else{
			res.render('vacancy/show',{vac:foundVacancy, currentUser:res.locals.currentUser});
		}
	})
})

app.get('/institute/:id1/vacancy/:id2/show',function(req, res){
	Vacancy.findById(req.params.id2, function(err, foundVacancy){
		if(err){
			console.log(err);
		}else{
			res.render('vacancy/show',{vac : foundVacancy, currentUser:res.locals.currentUser});		
		}
	})
	
})

app.listen(3000, function(){
	console.log("Server Started!")
})