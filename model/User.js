const mongoose = require('mongoose');
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
        contact: {
            phone: {
                type: String,
            },
            email: {
                type: String,
            },
        },
        address: {
            nation: {
                type: String,
                trim: true,
            },
            others: {
                type: String,
                trim: true,
            },
        },
        roles: {
            type: Array,
            default: ['user'],
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

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;
