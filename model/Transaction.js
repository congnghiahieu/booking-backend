const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransactionSchema = new Schema(
    {
        userId: {
            // type: mongoose.Schema.Types.ObjectId,
            // ref: 'User',
            type: Schema.Types.ObjectId,
            required: true,
        },
        cardSeries: {
            type: String,
            required: true,
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
