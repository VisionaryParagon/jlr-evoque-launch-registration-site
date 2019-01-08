// dependencies
const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const expressSession = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;

// get env vars
const dotenv = require('dotenv');
dotenv.config();

// db
/*
mongoose.connect('mongodb://' + process.env.DBUSR + ':' + process.env.DBPWD + '@ds145043.mlab.com:45043/jlr-evoque-launch', {
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 1000
})
  .then(dbRes => console.log('Connected to DB', dbRes.connections[0].name))
  .catch(dbErr => console.log('Error connecting to DB', dbErr));
*/
mongoose.connect('mongodb://' + process.env.DBUSR + ':' + process.env.DBPWD + '@ds151334-a0.mlab.com:51334,ds151334-a1.mlab.com:51334/jlr-evoque-launch?replicaSet=rs-ds151334', {
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 1000
})
  .then(dbRes => console.log('Connected to DB', dbRes.connections[0].name))
  .catch(dbErr => console.log('Error connecting to DB', dbErr));

// models
const admin = require('./server/models/admin');

// get routes
const regRoute = require('./server/routes/registrant');
const emailRoute = require('./server/routes/email');
const adminRoute = require('./server/routes/admin');
const waveRoute = require('./server/routes/waves');

const app = express();

// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(expressSession({
  secret: process.env.AUTOMATIK_KEY,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// configure passport
passport.use(new localStrategy(admin.authenticate()));
passport.serializeUser(admin.serializeUser());
passport.deserializeUser(admin.deserializeUser());

// https redirect
app.all('*', (req, res, next) => {
  if (req.headers['x-forwarded-proto'] == 'https' || (req.hostname != 'landroverlaunches.com' && req.hostname != 'www.landroverlaunches.com')) {
    next();
  } else {
    console.log(req.protocol + process.env.PORT + '' + req.hostname + req.url);
    return res.redirect('https://' + req.get('host') + req.url);
  }
});

// API endpoints
app.use('/reg', regRoute);
app.use('/eml', emailRoute);
app.use('/admn', adminRoute);
app.use('/wvs', waveRoute);

// Serve static files from dist folder
app.use(express.static(path.join(__dirname, 'dist/public')));

// Serve all other routes through index.html
app.all('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/public/index.html'));
});

// get port from environment and store in Express
const port = process.env.PORT || '80';
app.set('port', port);

// create HTTP server
const server = http.createServer(app);

// listen on provided port, on all network interfaces
server.listen(port, () => console.log(`API running on localhost:${port}`));
