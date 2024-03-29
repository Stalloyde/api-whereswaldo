const mongoose = require('mongoose');
const Schema = mongoose.Schema();

const playerSchema = new Schema({
  name: { type: String, required: true },
  score: { Type: Date, required: true },
});

module.exports = mongoose.model('Player', playerSchema);
