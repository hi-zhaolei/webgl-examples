var express = require('express')
var bodyParser = require('body-parser')
var app = express();
var path = require('path')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('static'))
app.get('/', function(req, res){
	res.sendFile('FIXME',function(){
	})
});
app.get('/lesson/:lid', function(req, res){
	var lid = req.params.lid;
	var filepath = path.join(__dirname,`examples/lesson${lid}/index.html`);
	res.sendFile(filepath, function (err) {
		if(err){
			console.log(err)
			res.status(err.status).end()
		} else {
			console.log(`send file lesson${lid}`)
		}
	})
})
app.listen(3000)
