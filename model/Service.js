const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);
const Schema = mongoose.Schema;
const { rmWs } = require('../utils/getSearchRegex');
const { getRan, getDiscount } = require('../utils/random');

const ServiceSchema = new Schema(
    {
        hotelId: {
            type: Schema.Types.ObjectId,
            ref: 'Hotel',
            required: true,
        },
        name: {
            type: String,
            trim: true,
            required: true,
        },
        slug: {
            type: String,
            slug: 'name',
            uniqueSlug: true,
        },
        images: [String],
        prices: {
            type: Number,
            required: true,
            default: () => getRan(400000, 1000000, 3),
        },
        discount: {
            type: Number,
            default: () => getDiscount(20, 40),
        },
        point: {
            type: Number,
            default: () => getRan(8, 10, 1),
        },
        totalRooms: {
            type: Number,
            default: 10,
            min: 0,
        },
        availableRooms: {
            type: Number,
            min: 0,
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
        info: {
            beds: {
                type: Number,
                default: 1,
            },
            area: {
                type: Number,
                default: 30,
            },
            attrs: {
                type: [
                    {
                        k: {
                            type: String,
                        },
                        v: {
                            type: String,
                        },
                        u: {
                            type: String,
                        },
                    },
                ],
                default: [],
            },
        },
    },
    {
        timestamps: true,
    },
);

ServiceSchema.pre('save', function () {
    this.name = rmWs(this.name);
});

ServiceSchema.virtual('occupiedRooms').get(function () {
    return this.totalRooms - this.availableRooms;
});

const ServiceModel = mongoose.model('Service', ServiceSchema);

module.exports = ServiceModel;
