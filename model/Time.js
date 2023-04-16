const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Time = new Schema({
    start: {
        type: Date,
        default: () => Date.now(),
    },
    end: {
        type: Date,
        default: '2100-12-31',
    },
});

module.exports = {
    Time,
};
