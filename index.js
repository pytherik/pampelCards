const express = require('express');
const exphbs = require('express-handlebars');
// const mongoose = require('./connectDB');
const path = require('path');
const app = express();

const indexController = require('./controllers/indexController');
const randomCardController = require('./controllers/randomCardController');

app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/index', indexController.welcome);
app.use('/card', randomCardController.getRandomCard);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
