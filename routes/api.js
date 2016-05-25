'use strict';

var express = require('express');
var router = express.Router();


router.use('/beers', require('./beers'));




module.exports = router;
