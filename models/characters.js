const mongoose = require('mongoose');
const { Schema } = mongoose;

const characterSchema = new Schema({
  name: { type: String, required: true },
  xCoordinate: { type: Number, required: true },
  yCoordinate: { type: Number, required: true },
});

module.exports = mongoose.model('Characters', characterSchema);
