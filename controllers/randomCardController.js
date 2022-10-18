const cards = require('../models/karten');

function getRandomCard(req, res) {
  const num = Math.floor(Math.random() * cards.length)
  const randomCard = cards[num]
  // console.log(num);
  res.render('randomCardPage', {
    header: 'Jetzt wird\'s ernst!',
    title: 'PampelCards App',
    image: 'images/icons8-card-64.png',
    // windows path
    // image: 'images/icons8-card-64.png',
    randomCard
  });
};


module.exports = {
  getRandomCard
};