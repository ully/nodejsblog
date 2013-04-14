
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , ejs = require('ejs');


if(process.env.VCAP_SERVICES){
	  var env = JSON.parse(process.env.VCAP_SERVICES);
	  var mongo = env['mongodb-1.8'][0]['credentials'];
	}
else{
	var mongo = {
			"hostname":"localhost",
			"port":27017,
			"username":"",
			"password":"",
			"name":"",
			"db":"mydb"
	}
}
var utils = require('./utils');
utils.initdb(mongo);
var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
//  app.set('view engine', 'jade');
  app.set("view engine", "html");
  app.set('view options', {
	  layout: false
	});
  app.register("html", ejs);
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({ secret: "ully"}));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes
app.get('/*', function(req,res, next){
	var AccessLog = utils.mongoose.model("AccessLog");
	var accessLog = new AccessLog();
	accessLog.ip = req.connection.remoteAddress;
	accessLog.url = req.header("Referrer");
	accessLog.makedate = new Date();
	accessLog.save(function(err) {
		if (err) {
			console.log('save failed');
		}
	});
	next();
	
});
app.get('/', routes.index);
app.get('/index', routes.index);
app.get('/works', routes.works);
app.get('/blog', routes.blog);
app.get('/about', routes.about);
app.get('/admin', routes.admin);
app.get('/login', routes.login);
app.post('/login', routes.valid);
app.post('/admin/userinfo/edit', routes.admin_user_edit);
app.post('/admin/blog/add', routes.admin_blog_add);
app.get('/blog/:id', routes.show);



var port =  3000;
var host = 'localhost';
//app.listen(process.env.VMC_APP_PORT || 3000);  
app.listen(port, host);
//console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
