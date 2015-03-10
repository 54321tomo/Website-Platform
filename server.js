var http = require("http");
var fs = require("fs");
var mimeMap = {
  "js": "text/javascript",
  "json": "application/json",
  "css": "text/css",
  "html": "text/html",
  "mp4": "video/mp4",
  "png": "image/png",
  "jpg": "image/jpeg",
  "woff": "application/x-font-woff",
  "ttf": "application/octet-stream",
  "oft": "font/opentype"
};

// Server
server = http.createServer(function(req, res){
  var webDir = __dirname + "/website";
  var reqDir = webDir + req.url;
  var reqLevels = (req.url.match(/^(?:\/)(.*?)(?:[\/])?$/i)[1]).split(/\//);
  // Home
  if (reqLevels[0].match(/^(?:home|index)(?:\.html|\.php|\.htm)?$/i) || !reqLevels[0]) {
    fs.readFile(webDir + "/index.html", function(err, data){
      res.writeHead(200, {"Content-Type": "text/html"});
      res.end(data);
    });
  }

  // Static files
  else if (reqLevels[0].match(/^(?:static)$/i)) {
    fs.exists(reqDir, function(exists){
      if (exists) {
        var explodeDot = (reqLevels[reqLevels.length-1].split(/\./))
        var mime = mimeMap[explodeDot[explodeDot.length-1]] || false;
        res.writeHead(200, {"Content-Type": mime ? mime : "text/html"});
        if (mime) {
          fs.readFile(reqDir, function(err, data){
            res.end(data);
          });
        } else {
          fs.readFile(webDir + "/error/500.html", function(err, data){
            res.end(data);
          });
        }
      } else {
        fs.readFile(webDir + "/error/404.html", function(err, data){
          res.writeHead(200, {"Content-Type": "text/html"});
          res.end(data);
        });
      }
    });
  }

  // Watch
  else if (reqLevels[0].match(/^(?:watch|w|:)$/i)) {
    fs.readFile(webDir + "/watch.html", function(err, data){
      res.writeHead(200, {"Content-Type": "text/html"});
      res.end(data);
    });
  }

  // 404
  else {
    fs.readFile(webDir + "/error/404.html", function(err, data){
      res.writeHead(200, {"Content-Type": "text/html"});
      res.end(data);
    });
  }
});

// Listen
server.listen(80, "192.168.0.2", function(){
  console.log("AnimeKura online.")
});
