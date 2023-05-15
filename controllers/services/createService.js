const ServiceModel = require('../../model/Service');
const HotelModel = require('../../model/Hotel');
const { checkValidMongoId } = require('../../utils/checkValidMongoId');
const { getRan, getDiscount } = require('../../utils/random');

/*
  POST /v1/services
*/

const createService = async (req, res) => {
    const {
        hotelId,
        name,
        prices,
        discount,
        point,
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
        const hotel = await HotelModel.findById(hotelId).exec();

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
            prices,
            discount: discount || getDiscount(20, 40),
            point: point || getRan(8, 10, 1),
            totalRooms,
            availableRooms,
            info: {
                beds,
                area,
            },
        });

        // nếu tạo thành công 1 service, cập nhật thông tin cho hotel
        if (!hotel.cheapest || hotel.cheapest > newService.prices) {
            hotel.cheapest = newService.prices;
            hotel.discountOfCheapest = newService.discount;
        }

        await Promise.all([hotel.save(), newService.save()]);

        return res.status(201).json({
            message: `New service ${newService.name} of hotel ${hotel.name} created sucessfully`,
        });
    } catch (err) {
        // console.log(err);
        return res.status(422).json({
            message: `Create service failed. ${err.message}`,
            isError: true,
        });
    }
};

module.exports = {
    createService,
};
