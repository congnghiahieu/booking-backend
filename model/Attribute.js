const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AttributeSchema = new Schema({
    k: {
        type: String,
    },
    v: {
        type: String,
    },
    u: {
        type: String,
    },
});

module.exports = {
    AttributeSchema,
};
