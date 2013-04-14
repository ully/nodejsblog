/*
 * GET home page.
 */
var utils = require('../utils');
exports.index = function(req, res) {
	var Blog = utils.mongoose.model("Blog");
	var query = Blog.find({type:{$in:['recent', 'plan']}});
	query.sort('makedate', -1);
	query.limit(10);
	query.exec(function(err,docs){  
		res.render('index', {
			title : 'ully\'s bar',
			layout : true,
			blogs: docs,
		})
	}); 
	
};
exports.works = function(req, res) {
	
	var Blog = utils.mongoose.model("Blog");
	var query = Blog.find({type:'works'});
	query.sort('makedate', -1);
//	query.limit(10);
	query.exec(function(err,docs){  
		res.render('works', {
			title : 'works-ully\'s bar',
			layout : true,
			worksset: docs,
		})
	}); 
	
};

exports.blog = function(req, res) {
	var Blog = utils.mongoose.model("Blog");
	var query = Blog.find({type:'blog'});
	query.sort('makedate', -1);
//	query.limit(10);
	query.exec(function(err,docs){  
		res.render('blog', {
			title : 'works-ully\'s bar',
			layout : true,
			blogs: docs,
		})
	}); 
};
exports.about = function(req, res) {
	var UserInfo = utils.mongoose.model("UserInfo");
	UserInfo.findOne({id:1},function(err,docs){  
		res.render('about', {
			title : 'Works-ully\'s bar',
			layout : true,
			userinfo : docs
		})
	});  
	
};

exports.admin = function(req, res) {
	console.log("session"+req.session.user);
	var name = req.session.user ;
	if(name){
	var UserInfo = utils.mongoose.model("UserInfo");
	UserInfo.find({name:name},function(err,docs){
		if(docs.length>0) {
			res.render('admin', {
				title : 'Admin-ully\'s bar',
				layout : false
			})
		}else{
			res.redirect("/login");
		}
	})
	}else{
		res.redirect("/login");
	}
};

exports.admin_user_edit = function(req, res) {
	
	var UserInfo = utils.mongoose.model("UserInfo"); 
	var name1 = req.body.name;
	var intro1 = req.body.intro;
	var contact1 = req.body.contact;
	UserInfo.update({id:1,name:name1,intro:intro1,contact:contact1},function(error){
		if(error) {
			res.json({status:false});
		}
		res.json({status:true});
	})
	
};


exports.admin_blog_add = function(req, res) {
	
	var Blog = utils.mongoose.model("Blog"); 
	var blog = new Blog();
	blog.title = req.body.title;
	blog.content = req.body.content;
	console.log(blog.title+"==================="+blog.content);
	blog.type = req.body.type;
	blog.makedate = new Date();
	blog.save(function(error){
		if(error) {
			res.send("ĞÂÔöÊ§°Ü");
		}
		res.redirect("/admin");
	});
	
};

exports.show = function(req, res) {
	var id =  req.params.id;
	var Blog = utils.mongoose.model("Blog"); 
	
	Blog.findOne({id:id},function(err,docs){  
		console.log(docs);
		res.render('show', {
			title : docs.title+'-ully\'s bar',
			layout : true,
			blog: docs,
		})
	});
};

exports.login = function(req, res) {
	res.render('login', {
		title : 'Works-ully\'s bar',
		layout : false
	})
};

exports.valid = function(req, res) {
	var name = req.body.name;
	var password = req.body.password;
	var UserInfo = utils.mongoose.model("UserInfo");
	UserInfo.find({name:name,password:password},function(err,docs){
		if(docs.length>0) {
			req.session.user = name;
			res.redirect("/admin");
		}else{
			res.send("no login");
		}
	})
	
};