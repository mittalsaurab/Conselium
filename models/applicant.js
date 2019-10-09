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

	image: String,
	
	isApplicant :{type: Boolean, Default: false },

	appliedPosts:[{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Vacancy"
	}]
	
	

})

var applicant=mongoose.model("Applicant",applicantSchema);

module.exports=applicant;	