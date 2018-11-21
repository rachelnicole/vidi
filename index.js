const express = require('express'),
    app = express(),
    path = require('path'),
    fs = require('fs'),
    https = require('https'),
    port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

const httpsOptions = {
  key: fs.readFileSync('./key.pem'),
  cert: fs.readFileSync('./cert.pem')
};

const server = https.createServer(httpsOptions, app).listen(port, () => {
  console.log('server running at ' + port);
}); 