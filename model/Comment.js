const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        hotelId: {
            type: Schema.Types.ObjectId,
            ref: 'Hotel',
            required: true,
        },
        title: {
            type: String,
            trim: true,
            required: true,
        },
        content: {
            type: String,
            trim: true,
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

const CommentModel = mongoose.model('Comment', CommentSchema);

module.exports = CommentModel;
