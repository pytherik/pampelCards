const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
// const mongoose = require('./connectDB');
const path = require('path');

const cards = require('./models/karten');
const TWO_HOURS = 1000 * 60 * 60 * 2;

const app = express();

const middleware = require('./middleware');
const cardRouter = require('./routes/cardRoutes');
const loginRouter = require('./routes/loginRoutes')
const {
  PORT = 3000,
  NODE_ENV = 'developement',
  SESS_NAME = 'sid',
  SESS_SECRET = 'geheim!',
  SESS_LIFETIME = TWO_HOURS
} = process.env

const IN_PROD = NODE_ENV === 'production'

app.use(session({
  name: SESS_NAME,
  resave: false,
  saveUninitialized: false,
  secret: SESS_SECRET,
  cookie: {
    maxAge: SESS_LIFETIME,
    sameSite: true,
    secure: IN_PROD
  }
}))


app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.get('/', middleware.redirectLogin, (req, res, next) => {
  const num = Math.floor(Math.random() * cards.length)
  const randomCard = cards[num]
  // console.log(num);
  res.render('home', {
    header: 'Lernen mit PampelCards',
    title: 'PampelCards App',
    image: 'images/icons8-card-64.png',
    // windows path
    // image: 'images/icons8-card-64.png',
    randomCard
  });
});

app.use('/login', loginRouter);
app.use('/card', cardRouter);


app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
