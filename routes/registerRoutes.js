const express = require('express');
const app = express();
const router = express.Router();
const middleware = require('../middleware');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const cards = require('../models/karten');

// router.get('/', middleware.redirectHome, (req, res, next) )

app.use(bodyParser.urlencoded({ extended: false }));

router.get('/', (req, res) => {
  res.render('register', { layout: 'loginLayout' });
})

router.post('/', async (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const pass1 = req.body.password;
  const pass2 = req.body.password2;
  
  payload = req.body;

  if (username && email && pass1 && pass2) {
    if (pass1 !== pass2) {
      payload.errorMessage = 'Die Passwörter stimmen nicht überein!';
      errorMessage = 'Die Passwörter stimmen nicht überein!';
      return res.status(200).render('register', {
        layout: 'loginLayout',
        username: req.body.username,
        email: req.body.email,
        errorMessage: errorMessage
      });
    }
      
    const user = await User.findOne({
      $or: [
        { username: username },
        { email: email }
      ]
    })
      .catch((error) => {
        console.log(error);
        errorMessage = "Irgendwas stimmt hier nicht!";
        return res.status(200).render('register', {
          layout: 'loginLayout',
          username: req.body.username,
          email: req.body.email,
          errorMessage: errorMessage
        });
      });


    if (user == null) {
      // no user found
      const data = req.body;
      
      data.password = await bcrypt.hash(pass1, 10);

      User.create(data)
        .then((user) => {
          req.session.user = user;
          return res.redirect("/");
        });
    }
    else {
      // user already exists
      if (email == user.email) {
        errorMessage = "Email schon registriert!";

      } else {
        errorMessage = "Benutzername ist schon vergeben!";
      }
      res.status(200).render('register', { layout: 'loginLayout', username: req.body.username, email: req.body.email, errorMessage: errorMessage });  
    }
  }
  else {
    errorMessage = "Überprüfe deine Eingabe noch einmal!";
    res.status(200).render("register", { layout: 'loginLayout', username: req.body.username, email: req.body.email, errorMessage: errorMessage });
  }

})

module.exports = router;