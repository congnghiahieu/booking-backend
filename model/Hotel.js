const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);
const Schema = mongoose.Schema;
const { GeoLocationSchema } = require('./GeoLocation');
const { ContactSchema } = require('./Contact');
const { Time } = require('./Time');

const HotelSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    title: {
      type: String,
      trim: true,
      required: true,
    },
    slug: {
      type: String,
      slug: 'title',
      uniqueSlug: true,
    },
    contact: ContactSchema,
    desc: {
      type: String,
      trim: true,
      required: true,
    },
    thumbnails: [String],
    location: GeoLocationSchema,
    stars: {
      type: Number,
      default: 4,
    },
    cmtSum: {
      type: Number,
      default: 0,
    },
    bookedCount: {
      type: Number,
      default: 0,
    },
    availableTime: Time,
    createdTime: {
      type: Date,
      default: () => Date.now(),
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Hotel', HotelSchema);
