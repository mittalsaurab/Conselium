var mongoose=require("mongoose");

var vacancySchema= new mongoose.Schema({

	inst:{
		id:{	type: mongoose.Schema.Types.ObjectId,
				ref: "Institute"},
		name: String		
	},	
	
	salary: Number,
	
	exp: Number,

	description: String,

	minCriteria: String,

	prefCriteria: String,
	
	createdAt: {
		type:Date,
		default:Date.now
	},
	
	location: String,

	apply_by: String,

	applicants:[
		{	type: mongoose.Schema.Types.ObjectId,
			ref: "Applicant"}
	],

	shortlist:[
		{	type: mongoose.Schema.Types.ObjectId,
			ref: "Applicant"}
	],

	final_list:[
		{	type: mongoose.Schema.Types.ObjectId,
			ref: "Applicant"}
	]
		
})

var vacancy=mongoose.model("Vacancy",vacancySchema);

module.exports=vacancy;	