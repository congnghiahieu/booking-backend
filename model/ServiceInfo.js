const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AttributeSchema = require('./Attribute');

const ServiceInfoSchema = new Schema({
    beds: {
        type: Number,
        default: 1,
    },
    area: {
        type: Number,
        default: 30,
    },
    attrs: [AttributeSchema],
});

module.exports = {
    ServiceInfoSchema,
};
