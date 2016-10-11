var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);


app.use('/', express.static(__dirname + '/'));

app.get('/', function(req, res){
	res.sendfile('index.html');
});

io.on('connection', function(socket){
	console.log('First connection established');

	socket.on('initData', function(){
		socket.emit("QsAndCs", {
			QsAndCs: [
				{ 
					Q: "How much percentage of milk is produced by cows",
					C1: "90%", 
					C2: "80%",
					C3: "70%",
					A: 1
				},
				{ 
					Q: "How much percentage of eggs is consumed in China",
					C1: "30%", 
					C2: "40%",
					C3: "50%",
					A: 2
				},
				{ 
					Q: "How many calories does a slice of packaged bread contain",
					C1: "80", 
					C2: "160",
					C3: "240",
					A: 1 
				},
			]
		})
	});

	socket.on('sendResult', function(data){
		var num = data.numOfCorrect;
		var adj = "";
		if (num == 1) {
			adj = "some";
		} else if (num == 2){
			adj = "good";
		} else if (num == 3) {
			adj = "extensive";
		} else {
			adj = "few";
		}
		socket.emit("promptUpdate", {toDescribe: adj});
	});

	socket.on('disconnect', function(){
		console.log('Connection ended');
	});
});

http.listen(3050, function(){
	console.log('listening on *:3050');
});