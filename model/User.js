const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { rmWs } = require('../utils/getSearchRegex');

const UserSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
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
            default: '',
        },
        contact: {
            phone: {
                type: String,
                default: '',
            },
            email: {
                type: String,
                default: '',
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
        //   type: Sccbf3hhema.Types.Boolean,
        //   default: false,
        // },
        fav: [{ type: Schema.Types.ObjectId, ref: 'Hotel' }],
        cart: [{ type: Schema.Types.ObjectId, ref: 'Service' }],
    },
    {
        timestamps: true,
    },
);

UserSchema.pre('save', function () {
    this.address.others = rmWs(this.address.others);
    this.address.nation = rmWs(this.address.nation);
    this.contact.phone = rmWs(this.contact.phone);
    this.contact.email = rmWs(this.contact.email);
    this.name = rmWs(this.name);
});

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;
