var mongoose=require("mongoose");

var instituteSchema= new mongoose.Schema({
	
	image : String,

	user:{
			id:{
				type : mongoose.Schema.Types.ObjectId,
				ref : "User"
			},
			email : String 
		},

	instName:String,

	insType: String,

	location: String,

	rating: {type: Number,
			 Default: 0 },
	
	contactInfo:String,

	description: String,

			
})

var institute = mongoose.model("Institute",instituteSchema);

module.exports = institute;	