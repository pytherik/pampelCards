const mongoose = require('mongoose');
const marked = require('marked');
const slugify = require('slugify');
const createDomPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const dompurify = createDomPurify(new JSDOM().window);

const Schema = mongoose.Schema;

const CardsSchema = new Schema({
  author:        { type: Schema.Types.ObjectId, ref: 'CardsUser' },
  category:      { type: String },
  question:      { type: String, required: true, unique: true },
  description:   { type: String },
  slug:          { type: String, required: true, unique: true },
  answerMd:      { type: String, required: true },
  sanitizedHtml: { type: String, required: true },
  knownBy: [{ type: Schema.Types.ObjectId, ref: 'CardsUser' }],
  private: { type: Boolean, default: false },
}, { timestamps: true });

CardsSchema.pre('validate', function (next) {
  if (this.question) {
    this.slug = slugify(this.question, { lower: true, strict: true })
  }
  if (this.answerMd) {
    this.sanitizedHtml = dompurify.sanitize(marked.parse(this.answerMd));
  }
  next();

})

const Cards = mongoose.model('Cards', CardsSchema);

module.exports = Cards;

