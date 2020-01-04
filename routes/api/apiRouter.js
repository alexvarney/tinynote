var express = require('express');
var router = express.Router();

var usersRouter = require('./users');
var notesRouter = require('./notes');

router.use('/user', usersRouter);
router.use('/note', notesRouter);

module.exports = router;