/*
 * Name: Thales Barros Fajardo Valente
 * Student ID: 200400698
 * Date: 07/06/2020
 * 
 * Description: Main router file that connect all pages and POST functions
 */

'use strict';
var express = require('express');
var router = express.Router();
var passport = require('passport');
var bcrypt = require('bcryptjs');
var formidable = require('formidable');
var path = require('path');
var fs = require('fs');

var productModel = require('../models/products');
var userModel = require('../models/users');

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', { user: req.user, title: 'Home' });
});


//POST for login
router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureMessage: 'Invalid Login'
}));

/*Logout*/
router.get('/logout', function (req, res) {
    req.session.destroy(function (err) {
        res.redirect('/');
    });
});

// GET login page
router.get('/login', function (req, res) {
    res.render('login');
});

/*
// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /auth/google/callback
router.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }));

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
router.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function (req, res) {
        res.redirect('/');
    });
*/


// GET register page
router.get('/register', function (req, res) {
    res.render('register');
});

//POST register page
router.post('/register', function (req, res) {
    //insert a new registered user
    bcrypt.hash(req.body.password, 10, function (err, hash) {
        var registeredUser = {
            email: req.body.userEmail,
            password: hash,
            firstName: req.body.firstName,
            lastName: req.body.lastName
        };

        //Check if user already exists
        userModel.find({ email: registeredUser.email }, function (err, user) {
            if (err) console.log(err);
            if (user.length) console.log('Email already in use!');

            const newUser = new userModel(registeredUser);

            newUser.save(function (err) {
                console.log('Inserting new user!');
                if (err) console.log(err);
                req.login(newUser, function (err) {
                    console.log('Trying to login');
                    if (err) console.log(err);
                    return res.redirect('/');
                });
            });
        });
    });
});

// GET products page
router.get('/products', function (req, res) {

    productModel.find({}, function (err, docs) {

        if (!err) {

            res.render('products', { user: req.user, products: docs });
        }
        else {
            console.log(err);
            res.render('products', { user: req.user });
        }
    });
});

//POST products page
router.post('/products', function (req, res) {
    var form = new formidable.IncomingForm();
    //Specify our image file directory
    form.uploadDir = path.join(__dirname, '../public/images');
    form.parse(req, function (err, fields, files) {
        console.log('Parsed form.');
        //Update filename
        files.productImage.name = fields.productName + '.' + files.productImage.name.split('.')[1];
        //Create a new product using the Products Model Schema
        const product = new productModel({ productName: fields.productName, productPrice: fields.productPrice, productImage: files.productImage.name, userId: req.user._id });

        //Insert product into DB
        product.save(function (err) {
            console.log(err);
        });

        //Upload file on our server
        fs.rename(files.productImage.path, path.join(form.uploadDir, files.productImage.name), function (err) {
            if (err) console.log(err);
        });

    });

    form.on('error', function (err) {
        console.log(err);
    });

    form.on('end', function (err, fields, files) {
        console.log('File successfuly uploaded');
        res.redirect('/products');
    });
});

// GET products page
router.get('/userProducts', function (req, res) {

    productModel.find({}, function (err, docs) {

        if (!err) {

            res.render('userProducts', { user: req.user, products: docs });
        }
        else {
            console.log(err);
            res.render('/', { user: req.user });
        }
    });
});



/* GET update page */
router.get('/update/:id', function (req, res) {
    productModel.findById(req.params.id, function (err, newProduct) {
        if (err) console.log(err);
        //Render update page with specific article
        res.render('update', { product: newProduct })
    })
});

/* POST update page */
router.post('/update', function (req, res) {
    var form = new formidable.IncomingForm();
    //Specify our image file directory
    form.uploadDir = path.join(__dirname, '../public/images');
    form.parse(req, function (err, fields, files) {
        console.log(fields.productName);
        //Update filename
        files.productImage.name = fields.productName + '.' + files.productImage.name.split('.')[1];
        //Find and update by id
        productModel.findByIdAndUpdate(fields.id, { productName: fields.productName, productPrice: fields.productPrice, productImage: files.productImage.name }, function (err, model) {
            console.log(err);
            //Upload file on our server
            fs.rename(files.productImage.path, path.join(form.uploadDir, files.productImage.name), function (err) {
                if (err) console.log(err);
            });
            res.redirect('/userProducts');
        });
    });
});


/* POST delete page */
router.post('/delete/:id', function (req, res) {
    //Find and delete product
    productModel.findByIdAndDelete(req.params.id, function (err, model) {
        res.send({ "success": "Article Successfully Deleted!" })
    });
});

module.exports = router;