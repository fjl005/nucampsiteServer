var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
const passport = require('passport');
const config = require('./config');
// var cookieParser = require('cookie-parser');
// const session = require('express-session');
// const authenticate = require('./authenticate');

// When we invoke the require function for session-file-store, it's returning another function as its return value, then we immediately call that return function with the second parameter, session. 
// const FileStore = require('session-file-store')(session);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const campsiteRouter = require('./routes/campsiteRouter');
const promotionRouter = require('./routes/promotionRouter');
const partnerRouter = require('./routes/partnerRouter');
const uploadRouter = require('./routes/uploadRouter');
const favoriteRouter = require('./routes/favoriteRouter');

const mongoose = require('mongoose');

// const url = 'mongodb://localhost:27017/nucampsite';
const url = config.mongoUrl;
const connect = mongoose.connect(url, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Another way to set up error handling is by using it as the second parameter in the .then method. However, it's more common to use the catch method.
connect.then(() => console.log('Connected correctly to server'),
    err => console.log(err)
);

var app = express();

app.all('*', (req, res, next) => {
    if (req.secure) {
        return next();
    } else {
        console.log(`Redirecting to: https://${req.hostname}:${app.get('secPort')}${req.url}`);
        res.redirect(301, `https://${req.hostname}:${app.get('secPort')}${req.url}`);
    }
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// Express session has its own implementation of cookies, so let's remove cookieParser.
// app.use(cookieParser('12345-67890-09876-54321'));

// app.use(session({
//     name: 'session-id',
//     secret: '12345-67890-09876-54321',
//     saveUninitialized: false,
//     resave: false,
//     store: new FileStore()
// }))

// saveUninitialized: when a new session is created but then no updates are made to it, then at the end of the request it won't get saved because it would just be an empty session with no useful information. Plus, no cookie will be sent to the client. This prevents having a bunch of empty session files and cookies being set up.

// resave: once the session has been created and updated and saved, it will continue to be resaved whenever a request is made to that session even if it didn't have any updates that needed to be saved. This will help keep the session marked as active so it doesn't get deleted by the user still making requests.

// FileStore: save session information to server's hard disk instead of just in the running application memory.

// These two routers should be above the auth function because these don't need authentication. This is the home page and the users where you can login or sign up.

// These are only necessary if we are using sessions.
// app.use(passport.session());

app.use(passport.initialize());
app.use('/', indexRouter);
app.use('/users', usersRouter);

// authentication
// function auth(req, res, next) {
//     console.log(req.user);

//     if (!req.user) {
//         const err = new Error('You are not authenticated!');
//         res.setHeader('WWW-Authenticate', 'Basic');
//         err.status = 401;
//         return next(err);
//     } else {
//         // // If there is a signed cookie . user value, then...
//         // if (req.session.user === 'authenticated') {
//         //     return next();
//         // } else {
//         //     const err = new Error('You are not authenticated!');
//         //     err.status = 401;
//         //     return next(err);
//         // }
//         return next();
//     }
// }

// app.use(auth);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/campsites', campsiteRouter);
app.use('/promotions', promotionRouter);
app.use('/partners', partnerRouter);
app.use('/imageUpload', uploadRouter);
app.use('/favorites', favoriteRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
