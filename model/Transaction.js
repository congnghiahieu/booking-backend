const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransactionSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        card: {
            cardName: {
                type: String,
                required: true,
            },
            cardSeries: {
                type: String,
                required: true,
            },
            cardExpiredate: {
                type: Date,
                required: true,
                default: () => new Date('01-01-2026'),
            },
            cardCvc: {
                type: Number,
                required: true,
            },
        },
        value: {
            type: Number,
            required: true,
        },
        transType: {
            type: String,
        },
        status: {
            type: String,
        },
    },
    {
        timestamps: true,
    },
);

const TransactionModel = mongoose.model('Transaction', TransactionSchema);
module.exports = TransactionModel;
