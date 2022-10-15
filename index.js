const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const app = express();
const cards = require('./models/karten');


app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
  // res.send(`<h1>Alles klar</h1>`)
  const randomCard = cards[Math.round(Math.random() * cards.length)]
  console.log(randomCard);

  res.render('index', {
    header: 'Lernen mit PampelCards',
    title: 'PampelCards App',
    randomCard
  });
});







const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
