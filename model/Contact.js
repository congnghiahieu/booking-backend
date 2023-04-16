const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

const ContactSchema = new Schema({
    phone: {
        type: String,
    },
    email: {
        type: String,
        // validate: {
        //   validator: function (v) {
        //     return EMAIL_REGEX.test(v);
        //   },
        //   message: props => `${props.value} is not valid email`,
        // },
    },
});

module.exports = {
    ContactSchema,
};
