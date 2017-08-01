var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
// var routes = require('./routes');
var routes = require('./routes/index');
var users = require('./routes/users');
var partials = require('express-partials');
var app = express();
var settings = require('./models/settings');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');
var dbUrl = "mongodb://" + settings.host + "/" + settings.db;


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(partials());
app.use(flash());
app.use(session({
    secret: settings.cookieSecret,
    store: new MongoStore({
        host: '127.0.0.1',
        port: '27017',
        db: 'microblog',
        url: 'mongodb://localhost:27017/microblog'
    })
}));
app.use(function (req, res, next) {
    console.log("app.usr local");
    res.locals.user = req.session.user;
    res.locals.post = req.session.post;
    var error = req.flash('error');
    res.locals.error = error.length ? error : null;
    var success = req.flash('success');
    res.locals.success = success.length ? success : null;
    next();
});

app.use('/', routes);
app.use('/users', users);


app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
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
