const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { Time } = require('./Time');
const { ServiceInfoSchema } = require('./ServiceInfo');

const ServiceSchema = new Schema({
  hotelId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  name: {
    type: String,
    trim: true,
    required: true,
  },
  images: [String],
  prices: {
    type: Number,
    required: true,
  },
  totalRooms: {
    type: Number,
    min: 0,
  },
  availableRooms: {
    type: Number,
    min: 0,
  },
  availableTime: Time,
  info: ServiceInfoSchema,
});

ServiceSchema.virtual('occupiedRooms').get(function () {
  return this.totalRooms - this.availableRooms;
});

const ServiceModel = mongoose.model('Service', ServiceSchema);

module.exports = ServiceModel;
