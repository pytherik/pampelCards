const express = require('express');
const app = express();
const middleware = require('../middleware');
const router = express.Router();
const bodyParser = require('body-parser');
const User = require('../models/userModel');
const Cards = require('../models/cardsModel');

app.use(bodyParser.urlencoded({ extended: false }));


router.get('/', middleware.redirectLogin, async (req, res, next) => {
  const card = await Cards.findOne({ author: req.session.user._id });
  if (!card) {
    const payload = {
      header: 'Mach Karte',
      user: req.session.user,
    }
    console.log('Du hast noch keine Karten erstellt.');
    payload.header = 'Mach neue Karte'
    return res.render('newCard', payload);
  }


  const cards = await Cards.find({ author: req.session.user._id }).lean();
  
  const num = Math.floor(Math.random() * cards.length)
  const randomCard = cards[num]
  // console.log(cards);
  // console.log(randomCard, cards.length);
  const payload = {
    header: 'Jetzt wird\'s ernst!',
    user: req.session.user,
    randomCard,
    cat: req.params.cat
  }
  res.render('randomCardPage', payload);
});

router.get('/categories/:cat', middleware.redirectLogin, async (req, res, next) => {
  const card = await Cards.findOne({ author: req.session.user._id });
  if (req.params.cat) {
    console.log(req.params.cat);
  }
  if (!card) {
    const payload = {
      header: 'Mach Karte',
      user: req.session.user,
    }
    console.log('Du hast noch keine Karten erstellt.');
    payload.header = 'Mach neue Karte'
    return res.render('newCard', payload);
  }
  const cards = await Cards.find({
    $and: [
      { author: req.session.user._id },
      { category: req.params.cat }
    ]
  }).lean();
  
  const num = Math.floor(Math.random() * cards.length)
  const randomCard = cards[num]
  // console.log(cards);
  // console.log(randomCard, cards.length);
  const payload = {
    header: 'Jetzt wird\'s ernst!',
    user: req.session.user,
    randomCard,
    cat: req.params.cat
  }
  res.render('randomCardPage', payload);
});

router.post('/', async (req, res) => {
  const category = req.body.category;
  const question = req.body.question;
  const answerMd = req.body.answerMd;
  const payload = {
    category: category,
    question: question,
    answerMd: answerMd
  };
  
  if (category && question && answerMd) {
    const quest = await Cards.findOne({ question: question});
    if (quest == null) {
      const data = req.body;
      data.author = req.session.user._id;
      data.knownBy = [];
      Cards.create(data);
      return res.redirect('/card');
    } else {
      payload.errorMessage = 'Deine Frage existiert schon.';
      return res.render('newCard', payload)
    }
  } else {
    payload.errorMessage = 'Bitte fülle alle Felder aus!';
    return res.render('newCard', payload);
  }
})

router.put('/:id', async (req, res) => {
  const category = req.body.category;
  const question = req.body.question;
  const description = req.body.description;
  const answerMd = req.body.answerMd;
 
  if (category && question && answerMd) {  
    let card = await Cards.findById(req.params.id);
    card.category = category;
    card.question = question;
    card.description = description;
    card.answerMd = answerMd;
    console.log('hallo');
    try {
      card = await card.save();
      console.log(card);
      return res.redirect('/card');
    } 
    catch (err) {
      console.log(err);
      res.redirect(`/card/editCard/${req.params.id}`)
    }
    return res.redirect('/card');
  } else {
    const errorMessage = 'Bitte fülle alle Felder aus!';
    return res.redirect(`/card/editCard/${req.params.id}`);
  }
})

router.delete('/:id', async (req, res) => {
  console.log(req.params.id)
  await Cards.findByIdAndDelete(req.params.id);
  res.redirect('/');
})
router.get('/newCard', async (req, res) => {
  const categories = await Cards.distinct('category');
  console.log(categories);
  res.render('newCard', { layout: 'main', 
  header: '',
  user: req.session.user,
  categories: categories
});
})

router.get('/editCard/:id', async (req, res) => {
  const card = await Cards.findOne({ _id: req.params.id });
  // console.log('card: ', card)
  res.render('editCard', {
    user: req.session.user,
    _id: card._id,
    category: card.category,
    question: card.question,
    description: card.description,
    answerMd: card.answerMd,
  });
})

module.exports = router;
