var express = require('express')
var bodyParser = require('body-parser')
var app = express();
var path = require('path')



app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('static'))

app.get('*', function(req, res){
	var filepath = path.join(__dirname, './', req.path)	
	if( req.path.indexOf('.') === -1 ) {
		filepath = path.join( filepath, 'index.html' )
	} 
	res.sendFile(filepath, function (err) {
		if(err){
			console.log(err)
			res.status(err.status).end()
		} else {
			console.log(`send file ${filepath}`)
		}
	})
})
app.listen(3000)
