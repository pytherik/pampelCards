const cards = require('../models/karten');

function welcome(req, res) {
  // res.send(`<h1>Alles klar</h1>`)
  const randomCard = cards[Math.round(Math.random() * cards.length)]

  res.render('index', {
    header: 'Lernen mit PampelCards',
    title: 'PampelCards App',
    image: 'images/icons8-card-64.png',
    randomCard
  });
};


module.exports = {
  welcome
};