const ServiceModel = require('../../model/Service');
const HotelModel = require('../../model/Hotel');
const checkValidMongoId = require('../../utils/checkValidMongoId');

/*
  PUT /v1/services/update_info
*/

const updateServiceInfoById = async (req, res) => {
    const { id, hotelId, name, prices, totalRooms, availableRooms, beds, area } = req.body;

    // Check for data fullfil
    if (!id || !hotelId) {
        return res.status(400).json({
            message: 'Bad request. Required service ID and hotel ID',
        });
    }

    // Check valid mongo ID
    const { isValid, errMsg, errCode } = checkValidMongoId(id, hotelId);
    if (!isValid) return res.status(errCode).json(errMsg);

    // Check valid data
    if (availableRooms > totalRooms) {
        return res.status(400).json({
            message: 'Bad request. Required available rooms less than or equal total rooms',
        });
    }

    try {
        // Check for exist hotel
        const hotel = await HotelModel.findById(hotelId).exec();

        if (!hotel) {
            return res.status(400).json({ message: 'Bad request. Hotel not found' });
        }
        // Check for exist service
        const service = await ServiceModel.findById(id).exec();

        if (!service) {
            return res.status(400).json({ message: 'Bad request. Service not found' });
        }

        // Update new information
        if (name) {
            // Check if name is available
            // Check for duplicate service name
            const otherSvList = await ServiceModel.find({
                hotelId,
                _id: {
                    $ne: id,
                },
            })
                .lean()
                .exec();
            if (otherSvList?.length) {
                if (!otherSvList.every(sv => sv.name != name)) {
                    return res.status(409).json({
                        message: 'Same service name in one hotel',
                    });
                }
            }
            service.name = name;
        }
        if (prices) {
            service.prices = prices;
            // Cập nhật giá hotel
            if (!hotel.cheapest || hotel.cheapest > service.prices) {
                hotel.cheapest = service.prices;
                hotel.discountOfCheapest = service.discount;
            }
        }
        if (totalRooms) service.totalRooms = totalRooms;
        if (availableRooms) service.availableRooms = availableRooms;
        if (beds) service.info.beds = beds;
        if (area) service.info.area = area;

        await Promise.all([hotel.save(), service.save()]);

        const resMsg = `Service ID ${result._id} with ${name ? 'new name' : 'name'} ${
            result.name
        } in hotel ${hotel.name} updated sucessfully`;

        return res.status(201).json({
            message: resMsg,
        });
    } catch (err) {
        console.log(err);
        return res.status(422).json({
            message: `Update service with ID ${id} failed`,
            isError: true,
        });
    }
};

module.exports = {
    updateServiceInfoById,
};
