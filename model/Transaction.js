const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransactionSchema = new Schema(
  {
    userId: {
      // type: mongoose.Schema.Types.ObjectId,
      // ref: 'User',
      type: Schema.Types.UUID,
      required: true,
    },
    transType: {
      type: String,
    },
    cardSeries: {
      type: String,
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const TransactionModel = mongoose.model('Transaction', TransactionSchema);
module.exports = {
  TransactionSchema,
  TransactionModel,
};
