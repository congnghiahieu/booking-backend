const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookSchema = new Schema(
    {
        userId: {
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
        serviceId: {
            // type: Schema.Types.ObjectId,
            // ref: 'Service',
            type: Schema.Types.ObjectId,
            required: true,
        },
        transactionId: {
            // type: Schema.Types.ObjectId,
            // ref: 'Transaction',
            type: Schema.Types.ObjectId,
            // required: true,
        },
        period: {
            start: {
                type: Date,
                default: () => Date.now(),
            },
            end: {
                type: Date,
                default: '2100-12-31',
            },
        },
        isPaid: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    },
);

const BookModel = mongoose.model('Book', BookSchema);

module.exports = BookModel;
