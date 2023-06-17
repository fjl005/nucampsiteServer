const express = require('express');
const User = require('../models/user');
const passport = require('passport');
const authenticate = require('../authenticate');

const router = express.Router();

/* GET users listing. */
router.route('/')
    .get(authenticate.verifyUser, authenticate.verifyAdmin, function (req, res, next) {
        User.find()
            .then(users => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(users);
                res.send(users);
            })
            .catch(err => next(err));
    });

// Let's create a post method for when a new user tries to sign up
router.post('/signup', (req, res, next) => {
    // We will rewrite the code below with the passport local mongoose register plugin
    // User.findOne({ username: req.body.username })
    //     .then(user => {
    //         if (user) {
    //             // If truthy, then the user document was found with a matching name.
    //             const err = new Error(`User ${req.body.username} already exists!`);
    //             err.status = 403;
    //             return next(err);
    //         } else {
    //             User.create({
    //                 username: req.body.username,
    //                 password: req.body.password
    //             })
    //                 .then(user => {
    //                     res.statusCode = 200;
    //                     res.setHeader('Content-Type', 'application/json');
    //                     res.json({ status: 'Registration Successful!', user: user });
    //                 })
    //                 .catch(err => next(err));
    //         }
    //     })
    //     .catch(err => next(err));

    // Three arguments for register method: first will be the new user given to us by the client, second will be the password which we'll plug from the incoming client request, third is a callback function which will receive an error (or null if no error)
    User.register(
        new User({ username: req.body.username }),
        req.body.password,
        (err, user) => {
            if (err) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.json({ err: err });
            } else {
                if (req.body.firstname) {
                    user.firstname = req.body.firstname;
                }

                if (req.body.lastname) {
                    user.lastname = req.body.lastname;
                }
                user.save(err => {
                    if (err) {
                        res.statusCode = 500;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({ err: err });
                        return;
                    }
                    passport.authenticate('local')(req, res, () => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({ success: true, status: 'Registration Successful!' });
                    })
                })
                // If no error, then we will authenticate

            }
        }
    )
})

router.post('/login', passport.authenticate('local'), (req, res) => {

    const token = authenticate.getToken({ _id: req.user._id });

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({ success: true, token: token, status: 'You are successfully logged in!' });
    // if (!req.session.user) {
    //     const authHeader = req.headers.authorization;

    //     if (!authHeader) {
    //         const err = new Error('You are not authenticated!');
    //         res.setHeader('WWW-Authenticate', 'Basic');
    //         err.status = 401;
    //         return next(err);
    //     }

    //     const auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    //     const username = auth[0];
    //     const password = auth[1];

    //     User.findOne({ username: username })
    //         .then(user => {
    //             if (!user) {
    //                 const err = new Error(`User ${username} does not exist!`);
    //                 err.status = 401;
    //                 return next(err);
    //             } else if (user.password !== password) {
    //                 const err = new Error('Your password is incorrect!');
    //                 err.status = 401;
    //                 return next(err);
    //             } else if (user.username === username && user.password === password) {
    //                 req.session.user = 'authenticated';
    //                 res.statusCode = 200;
    //                 res.setHeader('Content-Type', 'text/plain');
    //                 res.end('You are authenticated!')
    //             }
    //         })
    //         .catch(err => next(err));
    // } else {
    //     // This means there is a session already tracked for this client, already logged in.
    //     res.statusCode = 200;
    //     res.setHeader('Content-Type', 'text/plain');
    //     res.end('You are already authenticated!');
    // }
});

router.get('/logout', (req, res, next) => {
    if (req.session) {
        // Delete/Destroy the session file on the server side
        req.session.destroy();
        res.clearCookie('session-id');
        res.redirect('/');
    } else {
        // The client is requesting to log out when they haven't logged in.
        const err = new Error('You are not logged in!');
        err.status = 401;
        return next(err);
    }
})

module.exports = router;
