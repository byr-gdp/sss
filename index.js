#!/usr/bin/env node

const path = require('path');
const http = require('http');
const serveStatic = require('serve-static');
const serveIndex = require('serve-index');

// 各种路径的深坑：https://github.com/imsobear/blog/issues/48
// console.log(__dirname);
// console.log(__filename);
// console.log(process.cwd());
// console.log(path.resolve('./'));
const serve = serveStatic(process.cwd());
const index = serveIndex(process.cwd(), {'icons': true});

const errorHandlerWrapper = (req, res) => {
  return function() {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end('file or directory not exist');
  }
}

const server = http.createServer((req, res) => {
  const errorHandler = errorHandlerWrapper(req, res);
  serve(req, res, function(err) {
    if (err) {
      res.end(err);
    } else {
      index(req, res, errorHandler);
    }
  });
});

const port = process.env.PORT || 3000;
server.listen(port);
server.on('listening', () => {
  console.log('listening at port ' + port);
});
server.on('error', (e) => {
  console.error(e);
});