const express = require('express');
const app = express();
const router = express.Router();
const middleware = require('../middleware');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');

// router.get('/', middleware.redirectHome, (req, res, next) )

app.use(bodyParser.urlencoded({ extended: false }));

router.get('/', middleware.redirectHome, (req, res, next) => {
  res.render('login', { layout: 'loginLayout' });
})

router.post('/', middleware.redirectHome, async (req, res, next) => {
  const payload = req.body;

  if (req.body.username && req.body.password) {
    const user = await User.findOne({ username: req.body.username })
      .catch((error) => {
        console.log(error);
        payload.errorMessage = "Irgendwas stimmt hier nicht!";
        res.status(200).render("login", { layout: 'loginLayout', payload });
      });
    // console.log(user)
    // console.log(req.body.password)
    if (user != null) {
      const result = await bcrypt.compare(req.body.password, user.password);
      
      if (result === true) {
        req.session.user = user;
        return res.redirect("/");
      }
    }
  
    errorMessage = "Das haut nicht hin!";
    return res.status(200).render('login', {
      layout: 'loginLayout',
      username: req.body.username,
      errorMessage: errorMessage
    });
  }

  errorMessage = "Fülle bitte beide Felder aus!";

  res.status(200).render('login', {
    layout: 'loginLayout',
    username: req.body.username,
    errorMessage: errorMessage
  });
})

module.exports = router;