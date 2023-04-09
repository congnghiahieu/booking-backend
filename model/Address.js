const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AddressSchema = new Schema({
  nation: {
    type: String,
    trim: true,
  },
  others: {
    type: String,
    trim: true,
  },
});

module.exports = {
  AddressSchema,
};
