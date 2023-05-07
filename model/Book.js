const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { BOOK_STATUS } = require('../config/bookConst');
const { rmWs } = require('../utils/getSearchRegex');

const BookSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        cusInfo: {
            cusName: {
                type: String,
                required: true,
            },
            cusEmail: {
                type: String,
                required: true,
            },
            cusPhone: {
                type: String,
                required: true,
            },
        },
        hotelId: {
            type: Schema.Types.ObjectId,
            ref: 'Hotel',
            required: true,
        },
        serviceId: {
            type: Schema.Types.ObjectId,
            ref: 'Service',
            required: true,
        },
        transactionId: {
            type: Schema.Types.ObjectId,
            ref: 'Transaction',
        },
        status: {
            type: String,
            default: BOOK_STATUS.ONOGING,
        },
        isCanceled: {
            type: Boolean,
            default: false,
        },
        canceledTime: {
            type: Date,
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

BookSchema.pre('save', function () {
    this.cusInfo.cusName = rmWs(this.cusInfo.cusName);
    this.cusInfo.cusEmail = rmWs(this.cusInfo.cusEmail);
    this.cusInfo.cusPhone = rmWs(this.cusInfo.cusPhone);
});

const BookModel = mongoose.model('Book', BookSchema);

module.exports = BookModel;
