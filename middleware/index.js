var Applicant=require("../models/applicant");
var Institute=require("../models/institute");
var Vacancy = require("../models/vacancy");

var middleware={}

middleware.checkInstVacAuth = function(req, res, next){
	if(req.isAuthenticated()){
		Institute.findById(req.params.id1,function(err,foundInstitute){
			if(err) {
				console.log(err);
				req.flash("error","Institute is not found");
				res.redirect("back");
			}
			else{
				if(!foundInstitute){
					req.flash("error","Institute is not found");
					res.redirect("back");
				}
				if(req.user&&foundInstitute._id.equals(req.user._id)){
					 req.flash("success","Successfully ")

					 var found = false; 

					 foundInstitute.vacancyList.forEach(function(vac){
					 	if(vac._id == req.params.id2){
					 		found = true; 
					 	}
					 })

					 if(found){
						 next();	
					 }else{
					 	req.flash("error","You don't have permission to edit or delete someone else vacancy")
						res.redirect("back");
					 }


		
				}else{
					req.flash("error","You don't have permission to edit or delete someone else profile")
					res.redirect("back");
				}
			}
		})
	}else{
		req.flash("error","Please Login First ..!");
		res.redirect("/login");
	}
}



middleware.checkVacancyAuth=function (req,res,next){

	if(req.isAuthenticated()){
		Vacancy.findById(req.params.id,function(err,foundVacancy){
			if(err){
				console.log(err);
				req.flash("error","Applicant is not found");
				res.redirect("back");
			}
			else{
				if(!foundVacancy){
					req.flash("error","Camp is not found");
					res.redirect("back");
				}

				if(foundVacancy.inst.id.equals(req.user._id)){
					 req.flash("success","Successfully ");
					 next();			
				}else{
					req.flash("error","You don't have permission to edit someone else vacancy");
					res.redirect("back");
				}
			}
		})
	}else{
		req.flash("error","Please Login First ..!");
		res.redirect("/login");
	}

}


middleware.checkAppAuth=function(req,res,next){
	
	if(req.isAuthenticated()){
		Applicant.findById(req.params.id,function(err,foundApplicant){
			if(err) {
				console.log(err);
				req.flash("error","Applicant is not found");
				res.redirect("back");
			}
			else{
				if(!foundApplicant){
					req.flash("error","Camp is not found");
					res.redirect("back");
				}
				if(req.user&&foundApplicant._id.equals(req.user._id)){
					 req.flash("success","Successfully ")
					 next();			
				}else{
					req.flash("error","You don't have permission to edit or delete someone else profile")
					res.redirect("back");
				}
			}
		})
	}else{
		req.flash("error","Please Login First ..!");
		res.redirect("/login");
	}

}

middleware.checkInstAuth = function(req, res, next){
	if(req.isAuthenticated()){
		Institute.findById(req.params.id,function(err,foundInstitute){
			if(err) {
				console.log(err);
				req.flash("error","Institute is not found");
				res.redirect("back");
			}
			else{
				if(!foundInstitute){
					req.flash("error","Institute is not found");
					res.redirect("back");
				}
				if(req.user&&foundInstitute._id.equals(req.user._id)){
					 req.flash("success","Successfully ")
					 next();			
				}else{
					req.flash("error","You don't have permission to edit or delete someone else profile")
					res.redirect("back");
				}
			}
		})
	}else{
		req.flash("error","Please Login First ..!");
		res.redirect("/login");
	}
}


middleware.isLoggedIn=function(req,res,next){
		if(req.isAuthenticated()){
			return next();
		}else{
			req.flash("error","Please Login First ..!");
			res.redirect('/login');
		}
}



module.exports=middleware;