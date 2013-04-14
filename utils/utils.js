var mongoose = require('mongoose'), Schema = mongoose.Schema;
exports.initdb = function(mongo) {
	mongoose.connect("mongodb://" + mongo.username + ":" + mongo.password + "@" + mongo.hostname + ":" + mongo.port + "/" + mongo.db);
	
	//////////////////////
	var IdGenerator = new Schema({
	    modelname:{ type: String },
	    currentid:{ type: Number, default: 1}
	});
	mongoose.model('IdGenerator', IdGenerator);
	var autoInc = mongoose.model('IdGenerator');
	autoInc.getID = function(modelName, callback){
	    this.findOne({modelname : modelName},function(err,doc){
	        if(doc){
	            doc.currentid += 1;
	        }else{
	            doc = new autoInc();
	            doc.modelname = modelName;
	        }
	        doc.save(function(err){
	            if(err) throw err('IdGenerator.getID.save() error');
	            else callback(parseInt(doc.currentid.toString()));
	        });
	    });
	}	
	
	var UserInfoSchema = new Schema({
		id : {
			type : Number,
			index : true
		},
		name : {
			type : String
		},
		password : {
			type : String
		},
		intro : {
			type : String
		},
		contact :  {
			type : String
		}
	});
	mongoose.model("UserInfo", UserInfoSchema, "UserInfo");
	UserInfoSchema.pre('save', function(next){
		  var userInfoSchema = this;
		  autoInc.getID('UserInfoSchema',function(newid){
		    if(newid){
		    	UserInfoSchema.id = newid;
		    	next();
		    }
		  });
	});
	
	var UserInfo = mongoose.model("UserInfo");
	UserInfo.remove({},function(err,docs){
		console.log(docs);
	});
	var user = new UserInfo();
	user.name ="ully";
	user.password = "321";
	user.contact="nothing";
	user.intro="nothing";
	user.save(function(err) {  //´æ´¢  
		  if (err) {  
			    console.log('save failed');  
			  }  
			  console.log('save success');  
			});
	//////////////////////////////////////////////////////////////
	
	var BlogSchema = new Schema({
		id : {
			type : Number,
			index : true
		},
		title : {
			type : String
		},
		content : {
			type : String
		},
		type : {
			type : String
		},
		makedate :  {
			type : Date
		}
	});
	
	mongoose.model("Blog", BlogSchema, "Blog");
	BlogSchema.pre('save', function(next){
		  var blogSchema = this;
		  autoInc.getID('BlogSchema',function(newid){
		    if(newid){
		    	blogSchema.id = newid;
		    	next();
		    }
		  });
	});
	
	////////////////////////////////////////////////////
	
	var AccessLogSchema = new Schema({
		id : {
			type : Number,
			index : true
		},
		ip : {
			type : String
		},
		url : {
			type :String
		},
		makedate : {
			type : Date
		}
	});
	
	mongoose.model("AccessLog", AccessLogSchema, "AccessLog");
	
	AccessLogSchema.pre('save', function(next){
		  var accessLogSchema = this;
		  //????????ID
		  autoInc.getID('AccessLogSchema',function(newid){
		    if(newid){
		      accessLogSchema.id = newid;
		      next(); //????????????›Ômongo???
		    }
		  });
	});
	
	console.log("initdb ok");
};
exports.mongoose = mongoose;

//exports.saveexam = function() {
//	console.log("tt");
//	var Blog = mongoose.model("Blog");
//
//	var blog1 = new Blog();
//	blog1.id = 4;
//	blog1.title = "ully";
//
//	blog1.save(function(err) {
//		if (err) {
//			console.log('save failed');
//		}
//		console.log('save success');
//	});
//};

