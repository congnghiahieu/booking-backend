const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);
const Schema = mongoose.Schema;

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
        thumbnails: [String],
        location: {
            nation: {
                type: String,
                trim: true,
                default: 'Vietnam',
            },
            city: {
                type: String,
                trim: true,
                default: 'Ha Noi',
            },
            province: {
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
        },
        cmtSum: {
            type: Number,
            default: 0,
        },
        bookedCount: {
            type: Number,
            default: 0,
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

// HotelSchema.index({ name: 1, title: 1 });
// HotelSchema.index({ 'location.nation': 1, 'location.city': 1 });

const HotelModel = mongoose.model('Hotel', HotelSchema);

module.exports = HotelModel;
