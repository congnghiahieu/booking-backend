const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ServiceSchema = new Schema(
    {
        hotelId: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        name: {
            type: String,
            trim: true,
            required: true,
        },
        images: [String],
        prices: {
            type: Number,
            required: true,
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

ServiceSchema.virtual('occupiedRooms').get(function () {
    return this.totalRooms - this.availableRooms;
});

const ServiceModel = mongoose.model('Service', ServiceSchema);

module.exports = ServiceModel;
