const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const exphbs = require('express-handlebars');
const mongoose = require('./connectDB');
const path = require('path');

const Cards = require('./models/cardsModel');

const TWO_HOURS = 1000 * 60 * 60 * 2;

const app = express();

const middleware = require('./middleware');
const cardRouter = require('./routes/cardRoutes');
const loginRouter = require('./routes/loginRoutes');
const registerRouter = require('./routes/registerRoutes');
const logoutRouter = require('./routes/logoutRoute');

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
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, '/public')));

app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.get('/', middleware.redirectLogin, async (req, res, next) => {
  const card = await Cards.findOne({ author: req.session.user._id });
  const categories = await Cards.distinct('category');

  if (!card) {
    const randomCard = {
      question: 'Du hast noch keine Sammlung!',
      sanitizedHtml: '<a href="/card/newCard"><h1>Erstelle jeztz die erste Karte.</h1></a>',
      description: ''
    }
    const payload = {
      header: 'Mach Karte',
      user: req.session.user,
      randomCard
    }
    console.log('Du hast noch keine Karten erstellt.');
    payload.header = 'Mach neue Karte'
    return res.render('home', payload);
  } else {
    const cards = await Cards.find({ author: req.session.user._id }).lean();

    const num = Math.floor(Math.random() * cards.length)
    const randomCard = cards[num]
    // console.log(req.session.user);
    res.render('home', {
      header: 'Lernen mit PampelCards',
      user: req.session.user,
      randomCard,
      categories
    });
  }
});

app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/logout', logoutRouter);
app.use('/card', cardRouter);


app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
