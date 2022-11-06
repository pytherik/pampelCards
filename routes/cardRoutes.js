const express = require('express');
const app = express();
const middleware = require('../middleware');
const router = express.Router();
const bodyParser = require('body-parser');
const User = require('../models/userModel');
const Cards = require('../models/cardsModel');

app.use(bodyParser.urlencoded({ extended: false }));


router.get('/categories/:cat', middleware.redirectLogin, async (req, res, next) => {
  const cat = req.params.cat;
  const user = req.session.user;
  const header = 'Prüfe dein Wissen!';
  const payload = { header, user, cat };

  if (cat === 'all') {
    const cards = await Cards.find({ author: req.session.user._id }).lean();
    const num = Math.floor(Math.random() * cards.length)
    payload.randomCard = cards[num];
  }
  else {
    const cards = await Cards.find({
      $and: [
        { author: req.session.user._id },
        { category: req.params.cat }
      ]
    }).lean();
    const num = Math.floor(Math.random() * cards.length)
    payload.randomCard = cards[num];
  }  
  
  payload.isAuthor = user._id == payload.randomCard._id;
  
  return res.render('randomCardPage', payload);
});

router.post('/', async (req, res) => {
  const category = req.body.category;
  const question = req.body.question;
  const answerMd = req.body.answerMd;
  const payload = { category, question, answerMd };
  
  if (category && question && answerMd) {
    const quest = await Cards.findOne({ question: question});
    if (quest == null) {
      const data = req.body;
      data.author = req.session.user._id;
      data.knownBy = [];
      const newCard = await Cards.create(data);
      return res.redirect(`/card/detail/${newCard._id}`);
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
    if (req.body.private) {
      card.private = true;
    } else {
      card.private = false;
    }
    card.category = category;
    card.question = question;
    card.description = description;
    card.answerMd = answerMd;
    console.log('hallo');
    try {
      card = await card.save();
      console.log(card);
      return res.redirect(`/card/detail/${card._id}`);
    } 
    catch (err) {
      console.log(err);
      res.redirect(`/card/editCard/${req.params.id}`)
    }
    return res.redirect('/card');
  } else {
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
  const user = req.session.user;
  res.render('newCard', { user, categories });
//   res.render('newCard', { layout: 'main', 
//   header: '',
//   user: req.session.user,
//   categories: categories
// });
})

router.get('/editCard/:id', async (req, res) => {
  const card = await Cards.findOne({ _id: req.params.id });
  const categories = await Cards.distinct('category');
  const user = req.session.user;
  const payload = { card, user, categories };
  // res.render('editCard', { user, card });
  res.render('editCard', {
    user,
    categories,
    _id: card._id,
    category: card.category,
    question: card.question,
    description: card.description,
    answerMd: card.answerMd,
  });
})


router.get('/list/:cat', async (req, res) => {
  const cat = req.params.cat;
  const user = req.session.user;
  const header = cat;
  const payload = { header, user, cat };
  if (cat === 'all') {
    const cards = await Cards.find({ author: req.session.user._id }).sort({ updatedAt: -1 }).lean();
    payload.cards = cards;
  }
  else {    
    const cards = await Cards.find({
      $and: [
        { author: req.session.user._id },
        { category: req.params.cat }
      ]
    }).sort({ updatedAt: -1 }).lean();
    payload.cards = cards;
  }

  return res.render('listView', payload);
});

router.get('/detail/:id', async (req, res) => {
  const card = await Cards.findOne({ _id: req.params.id }).lean()
  if (!card) {
    return console.log('keine Karte mit dieser Id!')
  } 
  const isAuthor = card.author == req.session.user._id
  const payload = {
    user: req.session.user,
    isAuthor,
    card
  }
  console.log("details: ", card)
  console.log("is author: ", isAuthor)
  return res.render('detail', payload)
}) 

module.exports = router;
