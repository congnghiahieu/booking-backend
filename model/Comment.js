const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    hotelId: {
      type: Schema.Types.ObjectId,
      ref: 'Hotel',
    },
    title: {
      type: String,
      trim: true,
    },
    content: {
      type: String,
      trim: true,
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

module.exports = mongoose.model('Comment', CommentSchema);
