const ServiceModel = require('../../model/Service');
const HotelModel = require('../../model/Hotel');
const checkValidMongoId = require('../../utils/checkValidMongoId');
const path = require('path');

/*
  POST /v1/services
*/

const createService = async (req, res) => {
    const {
        hotelId,
        name,
        prices,
        totalRooms,
        availableRooms = totalRooms,
        beds = 1,
        area = 35,
    } = req.body;

    // Check for data fullfil
    if (!hotelId || !name || !prices || !totalRooms) {
        return res.status(400).json({
            message:
                'Bad request. Need full information includes: hotelId, name, prices, totalRooms',
        });
    }

    // Check valid mongo ID
    const { isValid, errMsg, errCode } = checkValidMongoId(hotelId);
    if (!isValid) return res.status(errCode).json(errMsg);

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
        const newService = new ServiceModel({
            hotelId,
            name,
            prices,
            totalRooms,
            availableRooms,
            info: {
                beds,
                area,
            },
        });

        const files = req.files;
        let imgsPath = [];
        // Save img
        Object.keys(files).forEach(key => {
            const absPath = path.join(
                __dirname,
                '../',
                '../',
                'public',
                'imgs',
                `services`,
                `${newService.id}`,
                files[key].name,
            );
            files[key].mv(absPath, err => {
                if (err) return res.status(500).json({ status: 'error', message: err });
            });
            const relPath = path.join(
                'public',
                'imgs',
                `services`,
                `${newService.id}`,
                files[key].name,
            );
            imgsPath.push(relPath);
        });

        newService.images = imgsPath;
        await newService.save();

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
