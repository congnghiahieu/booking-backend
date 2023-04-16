const ServiceModel = require('../../model/Service');
const HotelModel = require('../../model/Hotel');
const checkValidMongoId = require('../../utils/checkValidMongoId');

/*
  POST /v1/services
*/

const createService = async (req, res) => {
    const {
        hotelId,
        name,
        images,
        prices,
        totalRooms,
        availableRooms = totalRooms,
        beds = 1,
        area = 35,
    } = req.body;

    // Check for data fullfil
    if (!hotelId || !name || !images || !prices || !totalRooms) {
        return res.status(400).json({
            message:
                'Bad request. Need full information includes: hotelId, name, prices, totalRooms',
        });
    }

    // Check valid mongo ID
    const { isValid, errMsg, errCode } = checkValidMongoId(hotelId);
    if (!isValid) return res.status(errCode).json(errMsg);

    // Check for hotel thumbnails
    if (!Array.isArray(images) || !images?.length) {
        return res.status(400).json({
            message: 'Bad request. Need images as a non-empty array',
        });
    }

    try {
        // Check for exist hotel
        const hotel = await HotelModel.findById(hotelId).lean().exec();

        if (!hotel) {
            return res.status(400).json({ message: 'Bad request. Hotel ID not found' });
        }

        // Check for duplicate service
        const services = await ServiceModel.find({ hotelId }).lean().exec();

        if (services?.length) {
            if (!services.every(sv => sv.name != name)) {
                return res.status(409).json({
                    message: 'Same service name in one hotel',
                });
            }
        }

        // Create hotel
        const newService = await ServiceModel.create({
            hotelId,
            name,
            images,
            prices,
            totalRooms,
            availableRooms,
            info: {
                beds,
                area,
            },
        });

        console.log(newService);

        return res.status(201).json({
            message: `New service ${newService.name} of hotel ${hotel.name} created sucessfully`,
        });
    } catch (err) {
        console.log(err);
        return res.status(422).json({
            message: `Create service failed. ${err.message}`,
            isError: true,
        });
    }
};

module.exports = {
    createService,
};
