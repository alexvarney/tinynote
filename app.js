var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_HOST, {useNewUrlParser: true})
    .then(()=>console.log('Connected to Mongo'))
    .catch((err)=>Console.log(err))

var indexRouter = require('./routes/index');
var apiRouter = require('./routes/api/apiRouter');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api', apiRouter);

module.exports = app;
