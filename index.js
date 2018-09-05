
// This is how we add in node modules that we want to use in our application.
// Express is a web application framework, we are going to use it for our simple portfolio site.
const express = require('express'),
    app = express(),
    path = require('path'),
    fs = require('fs'),
    https = require('https'),
    port = process.env.PORT || 3000;

// Telling the app to use the public folder to serve our files is a nice and clean way to manage our site assets
app.use(express.static(path.join(__dirname, 'public')));

const httpsOptions = {
  key: fs.readFileSync('./key.pem'),
  cert: fs.readFileSync('./cert.pem')
}

// When the app is run we're going to listen on a port so we know when we have connections from clients
const server = https.createServer(httpsOptions, app).listen(port, () => {
  console.log('server running at ' + port)
})