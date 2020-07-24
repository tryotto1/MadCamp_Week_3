var http = require('http');
var fs = require('fs');

var server = http.createServer(function(request, response){
    fs.readFile('index.html', function(error, data){
        response.writeHead(200, {'Content-Type' : 'text/html'});
        response.end(data);
    })
});

server.listen(3000, function(){
    console.log("Server Listening on port number 52273");
})