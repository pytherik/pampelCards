const express = require('express');
const app = express();
const router = express.Router();
const middleware = require('../middleware');
// const bodyParser = require('body-parser');
// const bcrypt = require('bcrypt');
// const User = require('../schemas/UserSchema');
const cards = require('../models/karten');

// router.get('/', middleware.redirectHome, (req, res, next) )

router.get('/', (req, res) => {
  res.render('login');
})

module.exports = router;