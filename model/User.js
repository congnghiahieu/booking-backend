const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { rmWs } = require('../utils/getSearchRegex');
const jwt = require('jsonwebtoken');

const UserSchema = new Schema(
    {
        username: {
            type: String,
            // required: true,
            // unique: true,
        },
        password: {
            type: String,
            // required: true,
        },
        googleId: {
            type: String,
        },
        githubId: {
            type: String,
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
        // desc: {
        //   type: String,
        //   trim: true,
        // },
        avatarUrl: {
            type: String,
        },
        roles: {
            type: Array,
            default: ['user'],
        },
        refreshToken: [String],
        fav: [{ type: Schema.Types.ObjectId, ref: 'Hotel' }],
        cart: [{ type: Schema.Types.ObjectId, ref: 'Service' }],
    },
    {
        timestamps: true,
        methods: {
            genAt() {
                const accessToken = jwt.sign(
                    {
                        'UserInfo': {
                            username: this.username,
                            name: this.name,
                            email: this.contact.email,
                            address: this.address,
                            id: this.id,
                            roles: this.roles,
                        },
                    },
                    process.env.ACCESS_TOKEN_SERECT,
                    {
                        expiresIn: '15m',
                    },
                );
                return accessToken;
            },
            genRt() {
                const newRefreshToken = jwt.sign(
                    { username: this.username },
                    process.env.REFRESH_TOKEN_SERECT,
                    {
                        expiresIn: '1d',
                    },
                );
                return newRefreshToken;
            },
        },
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
