const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CardsSchema = new Schema({
  category: { type: String, trim: true },
  question: { type: String, trim: true },
  answer: [{ type: String, trim: true }],
  postedBy: { type: Schema.Types.ObjectId, ref: 'CardsUser' },
  knownBy: [{ type: Schema.Types.ObjectId, ref: 'CardsUser' }],
  replyTo: { type: Schema.Types.ObjectId, ref: 'Post' }
}, { timestamps: true });

const Cards = mongoose.model('Cards', CardsSchema);

module.exports = Cards;


