const cards = require('../models/karten');

function welcome(req, res) {
  const num = Math.floor(Math.random() * cards.length)
  const randomCard = cards[num]
  // console.log(num);
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