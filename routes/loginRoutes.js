const express = require('express');
const app = express();
const router = express.Router();
const middleware = require('../middleware');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');

// router.get('/', middleware.redirectHome, (req, res, next) )

app.use(bodyParser.urlencoded({ extended: false }));

router.get('/', (req, res) => {
  res.render('login');
})

router.post('/', async (req, res) => {
  const payload = req.body;

  if (req.body.username && req.body.password) {
    const user = await User.findOne({ username: req.body.username })
      .catch((error) => {
        console.log(error);
        payload.errorMessage = "Irgendwas stimmt hier nicht!";
        res.status(200).render("login", payload);
      });
    console.log(user)
    console.log(req.body.password)
    if (user != null) {
      const result = await bcrypt.compare(req.body.password, user.password);
      
      if (result === true) {
        req.session.user = user;
        return res.redirect("/");
      }
    }
  
    payload.errorMessage = "Das haut nicht hin!";
    return res.status(200).render("login", payload);
  }

  payload.errorMessage = "Fülle bitte beide Felder aus!";

  res.status(200).render("login"); 
})

module.exports = router;