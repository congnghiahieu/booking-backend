const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);
const Schema = mongoose.Schema;
const { rmWs } = require('../utils/getSearchRegex');
const { getRan, getDiscount } = require('../utils/random');

const HotelSchema = new Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
        },
        title: {
            type: String,
            trim: true,
            required: true,
        },
        slug: {
            type: String,
            slug: 'title',
            uniqueSlug: true,
        },
        contact: {
            phone: {
                type: String,
            },
            email: {
                type: String,
            },
        },
        desc: {
            type: String,
            trim: true,
            required: true,
        },
        imgsGG: [String],
        imgsRel: [String],
        location: {
            nation: {
                type: String,
                trim: true,
                default: 'Việt Nam',
            },
            province: {
                type: String,
                trim: true,
                default: 'Hà Nội',
            },
            district: {
                type: String,
                trim: true,
            },
            others: {
                type: String,
                trim: true,
            },
            ggmap: {
                coordinate: [Number],
            },
        },
        stars: {
            type: Number,
            default: 4,
        },
        cmtSum: {
            type: Number,
            default: 0,
        },
        bookedCount: {
            type: Number,
            default: 0,
        },
        cheapest: {
            type: Number,
        },
        discountOfCheapest: {
            type: Number,
        },
        point: {
            type: Number,
            default: () => getRan(7, 9, 1),
        },
        availableTime: {
            start: {
                type: Date,
                default: () => Date.now(),
            },
            end: {
                type: Date,
                default: '2100-12-31',
            },
        },
    },
    {
        timestamps: true,
    },
);

HotelSchema.pre('save', function () {
    this.location.nation = rmWs(this.location.nation);
    this.location.city = rmWs(this.location.city);
    this.location.province = rmWs(this.location.province);
    this.location.district = rmWs(this.location.district);
    this.location.others = rmWs(this.location.others);
    this.desc = rmWs(this.desc);
    this.contact.phone = rmWs(this.contact.phone);
    this.contact.email = rmWs(this.contact.email);
    this.title = rmWs(this.title);
    this.name = rmWs(this.name);
});

HotelSchema.virtual('discountPrice').get(function () {
    return (this.orginalPrice * this.discount) / 100;
});

// HotelSchema.index({ name: 1, title: 1 });
// HotelSchema.index({ 'location.nation': 1, 'location.city': 1 });

const HotelModel = mongoose.model('Hotel', HotelSchema);

module.exports = HotelModel;
