const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { rmWs } = require('../utils/getSearchRegex');
const { getRan } = require('../utils/random');

const CommentSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        user: {
            name: String,
            nation: String,
        },
        hotelId: {
            type: Schema.Types.ObjectId,
            ref: 'Hotel',
            required: true,
        },
        point: {
            type: Number,
            required: true,
            default: () => getRan(5, 10, 1),
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

CommentSchema.pre('save', function () {
    this.content = rmWs(this.content);
    this.title = rmWs(this.title);
});

const CommentModel = mongoose.model('Comment', CommentSchema);

module.exports = CommentModel;
