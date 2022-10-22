const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, required: true, trim: true, unique: true },
  email: { type: String, required: true, trim: true, unique: true},
  password: { type: String, required: true },
  profilePic: { type: String, default: "images/profilePics/profilePic.png" },
  knows: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
}, { timestamps: true });
 
const User = mongoose.model('CardsUser', UserSchema);

module.exports = User;


