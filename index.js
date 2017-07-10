var express = require('express')
var bodyParser = require('body-parser')
var app = express();
var path = require('path')
var fs = require('fs')
// var babel = require("babel-core")
// var browserify = require('browserify');
var webpack = require('webpack')
var webpackConfig = require('./webpack.config.js')

let jsPath;

app.set('views',path.join(__dirname , 'views') );
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('/'))

app.get('/', function(req, res){
	fs.readdir(__dirname, function(err, files){
		res.render('list', { files, rootPath: '' })
	})
})

app.get('/favicon.ico', function(req, res){
	res.send('')
})

app.get('/chapter*/*', function(req,res){
	const chapter = req.path.split('/')[1];
	const lesson = req.path.split('/')[2];
	jsPath = path.join(__dirname, './examples/', chapter,'/js/', lesson);
	res.render('index',{
		title: `${chapter} ${lesson}`,
	})
})

app.get("/dist/bundle.js", function(req, res){
	webpackConfig.entry = jsPath;
	webpack(webpackConfig, function(err, stats){
		if (err || stats.hasErrors()) {
			// Handle errors here
			console.log(err)
		}
		res.sendFile(path.resolve(__dirname, "dist/bundle.js"))
	})
})

app.get('/*', function(req, res){
	const filePath = path.join(__dirname,req.path)
	if(fs.statSync(filePath).isFile()){
		console.log(filePath)
		res.sendFile(filePath, function(err){
			if ( err ) console.log(err)
		})
	}
	if ( fs.statSync(filePath).isDirectory() ){
		fs.readdir(filePath, function(err, files){
			res.render('list', { files, rootPath: req.path })
		})
	}
})
app.listen(3000)
