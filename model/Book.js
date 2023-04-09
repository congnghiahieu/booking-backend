const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { Time } = require('./Time');

const BookSchema = new Schema(
  {
    owner: {
      // type: Schema.Types.ObjectId,
      // ref: 'User',
      type: Schema.Types.ObjectId,
      required: true,
    },
    hotelId: {
      // type: Schema.Types.ObjectId,
      // ref: 'Hotel',
      type: Schema.Types.ObjectId,
      required: true,
    },
    transactionId: {
      // type: Schema.Types.ObjectId,
      // ref: 'Transaction',
      type: Schema.Types.ObjectId,
      // required: true,
    },
    period: Time,
    isPaid: {
      type: Boolean,
      default: false,
    },
    createdTime: {
      type: Date,
      default: () => Date.now(),
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Book', BookSchema);
