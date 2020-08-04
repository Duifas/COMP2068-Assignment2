'use strict';
var debug = require('debug');
var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs');
var GoogleStrategy = require('passport-google-oauth20').OAuth2Strategy;

/*
 * Name: Thales Barros Fajardo Valente
 * Student ID: 200400698
 * Date: 07/06/2020
 * 
 * Description: Creation of the npm libraries and mainly the passport for user authentication
 */

//Addition of Mongo client for connection of database
const MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');
const uri = "mongodb+srv://admin:Thalesfv00@cluster0-vqo7y.mongodb.net/userStore?retryWrites=true&w=majority";

try {
    mongoose.connect(uri, { useNewUrlParser: true });
    var db = mongoose.connection;
    db.on('error', function (err) {
        console.log(err);
    });
    db.once('open', function (callback) {
        console.log('Connected to MongoDB');
    });
} catch (err) {
    console.log("Error : " + err);
}

var routes = require('./routes/index');
var users = require('./routes/users');
var userModel = require('./models/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//Required for passport session
app.use(session({
    secret: 'store',
    saveUninitialized: true,
    resave: true
}));

// required for passport session
app.use(passport.initialize());
app.use(passport.session());
app.use('/', routes);
app.use('/users', users);

//Serialize the user
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

//Deserialize the user
passport.deserializeUser(function (id, done) {
    userModel.findById(id, function (err, user) {
        if (err) console.log(err);
        done(err, user);
    });
});

//Local strategy for authenticating users
//Always looking for fields with name username and password
passport.use(new LocalStrategy(function (userEmail, password, done) {
    userModel.findOne({ email: userEmail }, function (err, user) {
        if (err) return done(err);
        if (!user) return done(null, false);
        //Compare hashed passwords
        if (!bcrypt.compareSync(password, user.password)) {
            return done(null, false);
        }
        return done(null, user);
    });
}));

/*
// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
passport.use(new GoogleStrategy({
    clientID: "944451347651-qn04pi7vka2meg6kvuvhpir0j6arr49h.apps.googleusercontent.com",
    clientSecret: "ooAvX7OTr6-PrMDiuwZhV-bY",
    callbackURL: "https://assignment2comp2068.herokuapp.com/auth/google/callback"
},
    function (accessToken, refreshToken, profile, done) {
        userModel.find({ email: profile.id }, function (err, user) {
            var newUser = { email: profile.id };
            const addUser = new userModel(newUser);
            addUser.save(function (err) {
                console.log('Inserting new user!');
                if (err) console.log(err);
                    return done(null, addUser);
            });
        });
    }
));
*/

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function () {
    debug('Express server listening on port ' + server.address().port);
});
