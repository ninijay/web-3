const
 http = require('http'),
 fs = require('fs');
 url = require('url'),
 path = require('path');server = http.createServer(function(request, response) {
   var uri = url.parse(request.url).pathname,
       filename = path.join(process.cwd(), uri);
   console.log("Serving: " + filename);
   fs.readFile(filename, 'binary', function(err, file) {
        if(err){
            response.writeHead(404);
            response.write("Not Found");
            response.end();
        }
        else{
            response.writeHead(200);
            response.write(file, 'binary');
            response.end();
        }
   })
});server.listen(8080, function(){
   console.log('listening on 8080');
});
