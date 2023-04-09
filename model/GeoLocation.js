const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GeoLocationSchema = new Schema({
  nation: {
    type: String,
    trim: true,
    default: 'Vietnam',
  },
  city: {
    type: String,
    trim: true,
    default: 'Ha Noi',
  },
  province: {
    type: String,
    trim: true,
  },
  others: {
    type: String,
    trim: true,
  },
  ggmap: {
    coordinate: [Number],
  },
});

module.exports = {
  GeoLocationSchema,
};
