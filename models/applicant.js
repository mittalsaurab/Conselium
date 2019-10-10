var mongoose=require("mongoose");

var applicantSchema = new mongoose.Schema({
	firstName: String,
	lastName: String,
	user:{
		id:{
			type : mongoose.Schema.Types.ObjectId,
			ref : "User"
		},
		email : String 
	},

	secondaryEmail: String,

	image: {type : String, Default: "url"},

	appliedPosts:[{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Vacancy"
	}]
	
	

})

var applicant=mongoose.model("Applicant",applicantSchema);

module.exports=applicant;	