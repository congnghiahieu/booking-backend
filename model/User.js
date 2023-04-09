const mongoose = require('mongoose');
const { AddressSchema } = require('./Address');
const { ContactSchema } = require('./Contact');
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    sessionId: {
      type: String,
    },
    name: {
      type: String,
      trim: true,
    },
    contact: ContactSchema,
    address: AddressSchema,
    roles: {
      User: {
        type: Number,
        default: 1000,
      },
      Admin: {
        type: Number,
      },
    },
    // desc: {
    //   type: String,
    //   trim: true,
    // },
    // avatarUrl: {
    //   type: String,
    // },
    // isGoogle: {
    //   type: Schema.Types.Boolean,
    // },
    refreshToken: [String],
    // isGithub: {
    //   type: Schema.Types.Boolean,
    //   default: false,
    // },
    fav: {
      type: Schema.Types.Array,
    },
    cart: {
      type: Schema.Types.Array,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('User', UserSchema);
