const mongoose = require('mongoose');
const { Schema } = mongoose;

const scoreSchema = new Schema({
  score: { type: Number, required: true },
  username: { type: String, required: true },
});

module.exports = mongoose.model('Score', scoreSchema);
