// module.exports=function(io){
const express = require("express");
const router = express.Router();
const User = require('../model/User');
const bcrypt = require('bcrypt');
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
// Requiring fs module in which 
const fs = require('fs')

const history = [];
//var socket=require ('socket.io');
// //var socket=io();
// var io=socket({wsEngine:'ws'});

router.use(cookieParser('secret'));
router.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true,
}))
router.use(passport.initialize());
router.use(passport.session());
router.use(flash());

router.use(function (req, res, next) {
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	next();
})
//register page
router.get("/", (req, res) => {
	res.render("register.ejs");
})

//register
router.post("/register", (req, res) => {
	let err;
	if (req.body.name == "" && req.body.email == "" && req.body.password == "") {
		err = "Please fill all the details";
		res.render("register.ejs", { err: err });
		console.log(err);
	}
	User.find({ email: req.body.email }).then((user) => {
		if (user.length >= 1) {
			err = "Email Already Exists";
			res.render("register.ejs", { err: err });
		}
		else {
			bcrypt.hash(req.body.password, 10, (err, hash) => {
				if (err) {
					throw err;
				}
				const user = new User;
				user.name = req.body.name;
				user.email = req.body.email;
				user.password = hash;
				console.log(user);

				user.save().then((user) => {
					console.log(user);
					req.flash('success_msg', 'Registered Successfully !')
					res.redirect("/login");
				});

			})
		}
	});
})

//Auth

var localStrategy = require('passport-local').Strategy;
passport.use(new localStrategy(({ usernameField: 'email' }),
	function (email, password, done) {
		User.findOne({ email: email }, function (err, data) {
			//console.log(data);
			if (err) { console.log(err); }
			if (!data) { return done(null, false, { message: 'User does not exist' }); }
			bcrypt.compare(password, data.password, (err, match) => {
				if (err) { return done(null, false); }
				if (!match) { return done(null, false, { message: 'Password does not match' }); }
				if (match) { return done(null, data); }
			})
			// if (!user.verifyPassword(password)) { return done(null, false); }
			// return done(null, user);
		});
	}
));


passport.serializeUser(function (user, cb) {
	cb(null, user._id)
})

passport.deserializeUser(function (_id, cb) {
	User.findById(_id, function (err, user) {
		cb(err, user)
	})
})

//auth check
const chekAuthenticated = function (req, res, next) {
	if (req.isAuthenticated()) {
		res.set('Cache-Control', 'no-cache,private,no-store,must-revalidate,post-check=0,pre-check=0');
		return next();
	}
	else {
		req.flash('error', 'Please Log in !')
		res.redirect("/login");
	}
}
//login page
router.get("/login", (req, res) => {
	res.render("login.ejs");
})

//login
router.post("/login", (req, res, next) => {
	let error;
	if (req.body.email == "" && req.body.password == "") {
		error = "Please fill all the details";
		res.render("login.ejs", { error: error });
		console.log(err);
	}
	passport.authenticate('local', {
		failureRedirect: '/login',
		successRedirect: '/home',
		failureFlash: true
	})(req, res, next);
})


//home
router.get("/home", chekAuthenticated, (req, res) => {
	res.render("home.ejs", { user: req.user });
})

// Data which will read from a file.

router.get('/read', function (req, res) {
	//var base64Data=req.body.imgBase64.replace(/^data:image\/png;base64,/, "");
	fs.readFile('test.txt', 'utf8', (err, data) => {
		if (err) {
			console.error(err)
			return
		}
		res.send(data);
		//console.log(data)
	})
	//console.log(base64Data);
})

// Data which will write in a file.

router.post('/save', function (req, res) {
	var base64Data = req.body.imgBase64;
	fs.writeFile("test.txt", base64Data, function (err) {
		if (err) {
			console.log(err);
		}
	})
	//console.log(base64Data);
})
// io.on('connection',(socket)=>{
// 	console.log(' A user is connected');
// 	console.log('syncings canvas from history');

// 	for (let item of history)
// 		socket.emit('update_sketch',item);

// 		socket.on('update_sketch',function(data){
// 			history.push(data);
// 			socket.broadcast.emit('update_sketch',data);
// 		})

// })





//logout
router.get("/logout", (req, res) => {
	req.logout();
	req.flash('success_msg', 'Successfully Logged out !')
	res.redirect("/login");
})
// return router;
// }
module.exports = router;